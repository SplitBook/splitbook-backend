const knex = require('../database');
const UserUtils = require('./UserUtils');
const PasswordUtils = require('./PasswordUtils');
const { generate, EnumTokenTypes } = require('./TokenUtils');
const { EnumEmailTypes } = require('../email');

const createSchoolEnrollment = async (
  class_id,
  school_year_id,
  student_number,
  student_name,
  guardian_name,
  guardian_email,
  student_photo
) => {
  student_number = String(student_number).padStart('7', '0');

  const trx = await knex.transaction();
  let sendEmailToUser = false;

  try {
    let student = await trx('students')
      .select('*')
      .where('students.number', student_number)
      .whereNull('students.deleted_at')
      .first();

    if (!student) {
      if (
        !String(student_photo).match(
          /^(http|https):\/\/+[\www\d]+\.[\w]+(\/[\w\d]+)?/
        )
      ) {
        student_photo = null;
      }

      [student] = await trx('students')
        .insert({
          number: student_number,
          name: student_name,
          photo: student_photo,
        })
        .returning('*');
    }

    let guardian = await trx('guardians')
      .select('guardians.*')
      .where('users.email', guardian_email)
      .innerJoin('users', 'users.id', 'guardians.user_id')
      .whereNull('guardians.deleted_at')
      .whereNull('users.deleted_at')
      .first();

    if (!guardian) {
      let user = await trx('users')
        .where('email', guardian_email)
        .whereNull('deleted_at')
        .first();

      if (!user) {
        const password = await PasswordUtils.encript('null');

        [user] = await trx('users')
          .insert({
            id: UserUtils.generateId(),
            username: guardian_name,
            email: guardian_email,
            password,
          })
          .returning('*');

        user.password = undefined;

        sendEmailToUser = true;
      }

      [guardian] = await trx('guardians')
        .insert({
          name: guardian_name,
          user_id: user.id,
        })
        .returning('*');
    }

    let schoolEnrollment = await trx('school_enrollments')
      .select('*')
      .whereNull('deleted_at')
      .where('student_id', student.id)
      .where('school_year_id', school_year_id)
      .first();

    if (schoolEnrollment) {
      await trx.rollback();
      return schoolEnrollment;
    } else {
      [schoolEnrollment] = await trx('school_enrollments')
        .insert({
          student_id: student.id,
          guardian_id: guardian.id,
          class_id,
          school_year_id,
        })
        .returning('*');
    }

    await trx.commit();

    if (sendEmailToUser) {
      const token = generate(
        {
          email: guardian_email,
        },
        EnumTokenTypes.EMAIL,
        '3 days'
      );

      // Show token to change password
      // console.log('Token', token)

      const Queue = require('../stack');

      await Queue.add(Queue.EnumQueuesTypes.SEND_MAIL, {
        to: guardian_email,
        emailType: EnumEmailTypes.REGISTER,
        properties: { token },
      });
    }

    return schoolEnrollment;
  } catch (err) {
    await trx.rollback();
    throw err;
  }
};

module.exports = { createSchoolEnrollment };

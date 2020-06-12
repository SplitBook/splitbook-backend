const { createSchoolEnrollment } = require('../../utils/SchoolEnrollmentUtils');

module.exports = {
  key: 'CreateSchoolEnrollment',
  async handle({ data }) {
    const {
      class_id,
      school_year_id,
      student_number,
      student_name,
      student_photo,
      guardian_name,
      guardian_email,
    } = data;

    if (
      class_id &&
      school_year_id &&
      student_number &&
      student_name &&
      guardian_name &&
      guardian_email
    ) {
      try {
        return createSchoolEnrollment(
          class_id,
          school_year_id,
          student_number,
          student_name,
          guardian_name,
          guardian_email,
          student_photo || null
        );
      } catch (err) {
        return err;
      }
    }

    return null;
  },
};

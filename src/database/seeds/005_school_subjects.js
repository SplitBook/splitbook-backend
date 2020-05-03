const schoolSubjects = require('../../utils/enums/EnumSchoolSubjects');

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('school_subjects')
    .del()
    .then(function () {
      // Inserts seed entries
      return knex('school_subjects').insert([
        { school_subject: schoolSubjects.PORTUGUESE },
        { school_subject: schoolSubjects.ENGLISH },
        { school_subject: schoolSubjects.MATH },
        { school_subject: schoolSubjects.CHEMISTRY },
        { school_subject: schoolSubjects.SCIENCE },
        { school_subject: schoolSubjects.HISTORY },
        { school_subject: schoolSubjects.GEOGRAPHY },
      ]);
    });
};

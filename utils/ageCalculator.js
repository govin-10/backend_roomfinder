const calculateAge = (dob) => {
  const currentDate = new Date();
  const birthDate = new Date(dob);

  if (birthDate > currentDate) {
    throw new Error("Invalid date of birth");
  }

  const age = currentDate.getFullYear() - birthDate.getFullYear();

  return age;
};

module.exports = calculateAge;

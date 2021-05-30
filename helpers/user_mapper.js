module.exports = (user, userDetails) => {
	if (userDetails.name)
		user.name = userDetails.name;
	if (userDetails.email_address)
		user.email = userDetails.email_address;
	if (userDetails.phonenumber)
		user.phoneNumber = userDetails.phonenumber;
	if (userDetails.username)
		user.username = userDetails.username;
	if (userDetails.password)
		user.password = userDetails.password;
	if (userDetails.status)
		user.status = userDetails.status;
	if (userDetails.gender)
		user.gender = userDetails.gender;
	if (userDetails.date_of_birth)
		user.dob = userDetails.date_of_birth
	if (userDetails.role)
		user.role = userDetails.role;
	if (userDetails.image)
		user.image = userDetails.image;
	if (!user.address)
		user.address = {};
	if (userDetails.tempAddress)
		user.address.tempAddress = userDetails.tempAddress.split(',');
	if (userDetails.perAddress)
		user.address.perAddress = userDetails.perAddress;
	return user;
};
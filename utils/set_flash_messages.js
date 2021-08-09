// this middleware sets the response.locals vars
const  set_flash_messages = (req, res, next) => {
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message = req.flash('error_message');
  res.locals.error = req.flash('error');
  next();
}

module.exports = set_flash_messages;
FlowRouter.route('/',{
action: function(){
	BlazeLayout.render("camera");
}
});
FlowRouter.route('/photo',{
action: function(){
	BlazeLayout.render("crop");
}
});
FlowRouter.route('/aboutus',{
action: function(){
	BlazeLayout.render("aboutus");
}
});/*
FlowRouter.route('/shirts',{
action: function(){
	BlazeLayout.render("shirts");
}
});*/

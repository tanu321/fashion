FlowRouter.route('/',{
action: function(){
	BlazeLayout.render("camera");
}
});
FlowRouter.route('/photo',{
action: function(){
	BlazeLayout.render("photo");
}
});

/*
Tiksluslens v 1.0.0 
Author: Pushpendra Singh Chouhan @ pushpendra.as400@gmail.com
http://tikslus.com
*/
(function($){
   var TikslusLens = function(element, options)
   {
       var element = $(element);
       var obj = this;

	   var loaded=false;
	   var moving=false;
	   var big_image_width=0;
	   var big_image_height=0;
	   var coord=new Object();//small image coordinates
	   var body=$("body");
	
	  
	   var defaults=
					{
					
					lensWidth:120,
					lensHeight:120,
					lensBackgroundColor:'#fff',
					lensBorderColor:'#000',
					showLens:false,
					loaderImage:'loader.gif',
					
					autoZoomRatio:false
					};

	   var small_img=element.find("img.tiksluslens");
	   var big_img=element.find("img.tiksluslens").attr("data-big-image");
	   var lens;
 // Extend our default options with those provided.
   options = $.extend(defaults, options);
	   
	
	   var getCoord=function(){
		coord.left=small_img.position().left;
		coord.top=small_img.position().top;
		coord.right=small_img.width();
		coord.bottom=small_img.height();
		return coord;
				}
	   
	   //create lens
	 var  createLens=function(){
	   element.append("<div class='lens'></div>");
	   
	   lens=element.find(".lens");
	   
	   if(options.showLens==true){
		lens.css({width:options.lensWidth,height:options.lensHeight,backgroundColor:options.lensBackgroundColor,border:'1px solid',borderColor:options.lensBordercolor});
			}
				else{
					lens.find(".lens").css({width:options.lensWidth,height:options.lensHeight,cursor:'crosshair'});

					}
					return lens;
			}
			//ends create lens
			
			var hideLens=function(){
			lens.css({visibility:'hidden'});
			}
			
			var showLens=function(){
			lens.css({visibility:'visible'});
			}
			
		
		createLens();
			
			//private method to get small image coordinates
		
		/***************Load big image in the zoom preview pan *********************/		
		//private method
		var loadBigImage=function(){
			
		var img_object=new Image();
		var sm_coord=getCoord();
		img_object.src=big_img;
		
		var sm_left=sm_coord.left+sm_coord.right/2;
		var sm_top=sm_coord.top+sm_coord.bottom/2;
		
		if(element.find(".zoom-loading").length<=0){
		element.append("<div class='zoom-loading'></div>");
		element.find(".zoom-loading").append("<img src='"+options.loaderImage+"' border='0'>");
		}
		small_img.addClass('fade');
		element.find(".zoom-loading").css({position:'absolute',left:sm_left+"px",top:sm_top+"px",zIndex:1000});
		$("body").css("cursor","none");//hide cursor;
		hideLens();//hide lens
		small_img.css({opacity:0.3});
		//try to load the big image into the zoom wrapper
		img_object.onload = function() {
			big_image_width=img_object.width;
			big_image_height=img_object.height;
			lens.css({"background-image":"url('"+img_object.src+"')",visibility:"visible"});
			element.find(".zoom-loading").remove();
			small_img.removeClass('fade');
			$("body").css("cursor","haircross");//show cursor;
			loaded=true;
			showLens();
			small_img.css({opacity:1});
				}
		
		
				}
				/****************end loadBigImage ***************/
				
				
			
				
				var attachLens=function(X,Y){
				var sm_coord=getCoord();
				ctop=Y-options.lensHeight/2-sm_coord.top;// is magnifier width/2
				cleft=X-options.lensWidth/2-sm_coord.left;//// is magnifier height/2
				lens.css({top:Y-options.lensHeight/2 + "px",left:X-options.lensWidth/2+"px",visibility:'visible',width:options.lensWidth + "px",height:options.lensHeight + "px"});
				moving=true;
				}
				
				var moveLens=function(X,Y){
				//var sm_coord=obj.getCoord();
				ctop=Y-options.lensHeight/2;// is magnifier width/2
				cleft=X-options.lensWidth/2;//// is magnifier height/2
				lens.css({top:Y-options.lensHeight/2 + "px",left:X-options.lensWidth/2+"px",width:options.lensWidth + "px",height:options.lensHeight + "px"});
				}
				
				var detachLens=function(){
				lens.css({top:0,left:0,widht:0,height:0,visibility:'hidden'});
				body.css({cursor:'default'});
				}
				
				 var zoom=function(X,Y){
				var sm_coord=getCoord();
			
				if(loaded==true && moving==true){
				var img_ratio_height=0; //ratio of large image height / small image height
				var img_ratio_width=0; // ratio of large image width / small image width
				
				img_ratio_width=parseFloat(big_image_width/small_img.width()).toFixed(1);
				img_ratio_height=parseFloat(big_image_height/small_img.height()).toFixed(1);
				
				img_ratio_width=parseFloat(big_image_width/small_img.width()).toFixed(1);
				img_ratio_height=parseFloat(big_image_height/small_img.height()).toFixed(1);
				
				var ctop=Y-options.lensHeight/2-sm_coord.top;// is magnifier width/2
				var cleft=X-options.lensWidth/2-sm_coord.left;//// is magnifier height/2
				
				//show zoomed image in lens
				lens.css({backgroundPosition:-(cleft*img_ratio_width) + "px "+ -(ctop*img_ratio_height ) +"px"});
				
				
				if(options.autoZoomRatio==true){
				
				lens.css("width",options.lensWidth*img_ratio_width+ "px");
				lens.css("height",options.lensHeight*img_ratio_height + "px");
				}
				
				}
				
				}
				
				
				small_img.mouseenter(function(e){
				if(moving==false){
				attachLens(e.pageX,e.pageY);
				
				}
				if(loaded==false){loadBigImage();}
				
				});
	
				
				small_img.mousemove(function(e){
				if(moving){
				zoom(e.pageX,e.pageY);
				moveLens(e.pageX,e.pageY);
				}
				
				
				});
			
				
	
	 
		
	   	lens.mousemove(function(e){
	if(e.pageX>=small_img.position().left && e.pageX<=(small_img.width() + small_img.position().left+options.lensWidth/2) && e.pageY>=small_img.position().top && (e.pageY<=small_img.height()+small_img.position().top+options.lensHeight/2) && moving==true){

	moveLens(e.pageX,e.pageY);
	zoom(e.pageX,e.pageY);
	
	}else{
	detachLens();
	body.css({cursor:'default'})
	moving=false;
	
	}
				});
				
		
		

		
	   
   };

   $.fn.tiksluslens = function(options)
   {
       return this.each(function()
       {
           var element = $(this);
          
           // Return early if this element already has a plugin instance
           if (element.data('tiksluslens')) return;

           // pass options to plugin constructor
           var tiksluslens = new TikslusLens(this, options);

           // Store plugin object in this element's data
           element.data('tiksluslens', tiksluslens);
       });
   };
})(jQuery);

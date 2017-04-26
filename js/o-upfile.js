/*
 * oUpload.js 基于HTML5 文件上传的血肉脚本 http://www.noweb.win/
 * by odr 2017-04-01   QQ : 68242331
*/
;(function(jQuery, window, document,undefined) {

          jQuery.fn.oFile=function(options) { 

               var defaults = {
                   phpurl: '.',
                   fileurl: '.',
               };
               var settings = $.extend({},defaults, options);//接收外部参数
               console.log(settings);
                          
               var self=jQuery(this);
               //增加准备大图查看
               jQuery('body').append("<div class='o-file-vi'><img src=''></div>");               
               //绑定选择文件
               self.on('click','.ofile-add',function(){
               	self.find('#ofileinput').click();
               })
               //绑定删除文件
               self.on('click','span',function(){
               	jQuery(this).parent().remove();
               	self.find('.ofile-msg').text(  self.find('li').length+"个文件已上传"  );//信息显示
               	return false;
               })

               //绑定移动事件
               self.on('click','i',function(){
               	var moveele=jQuery(this).parent();
               	moveele.prev().before(moveele);
               	return false;         	
               	
               })

               //绑定点击图片事件
               self.on('click','li',function(){
               	jQuery('.o-file-vi img').attr('src',jQuery(this).find('img').attr('src') ).parent().fadeIn(200);
               	
               	return false;
               })

               //绑定点击大图片退出图片事件
               jQuery('body').on('click','.o-file-vi',function(){
               	jQuery(this).fadeOut(200);
               	return false;
               });
               //文件上传控件change事件
               self.on('change','#ofileinput',function(){
                     var filesSize=0;//统计文件大小
                     var fileTypeError=0;//文件类型错误
               		var formData = new FormData();//使用formdata对象
               		jQuery.each(jQuery(this)[0].files,function(i,e){
               			filesSize+=e.size;//文件大小
               			if(   !(e.type=='image/jpeg' || e.type=='image/png')   ){//判断文件类型
               				fileTypeError=1;          				
               			}
               			formData.append('file[]', e);

               		})
               		if(fileTypeError){//判断文件格式
               			self.find('.ofile-msg').text(  "请选择PNG,JPG格式的文件"  );//信息显示
               		}else{


     		          		if(  (filesSize/1024/1024)<=2  ){//判断文件大小
     							jQuery.ajax({//上传服务器  
     							    url: settings.phpurl+'/up.php',  
     							    type: "POST", 				   
     							    cache: false,
     				          		contentType: false,  
     				          		processData: false, 
     							    data: formData,			     
     							    success: function(res){
     							    	var res=jQuery.parseJSON(res);//转化为json对象
     							    	if(res.code){//上传成功code=1
     							    		var html='';
     							    		jQuery.each(res.data, function(i, item){
     							    			//html
     							    			html += '<li>';
     							    			html += '<img src="'+settings.fileurl+'/'+item.name+'"><span></span><i><=</i>';
     							    			html +=	'<input type="hidden" name="pic[]" value="'+settings.fileurl+'/'+item.name+'" >';
     							    			html += '</li>';
     							    			
     							    		})//循环数据

     							    		self.find('.ofile-add').before(html);//更新图片预览

     							    		self.find('.ofile-msg').text(  self.find('li').length+"个文件已上传"  );//信息显示
     							    		
     							    	}else{
     							    		self.find('.ofile-msg').text(  "上传出错"  );//信息显示
     							    	}

     							    },
     							    error: function(e){
     							    	self.find('.ofile-msg').text(  "上传出错"  );//信息显示
     							    },
     							    beforeSend:function(){
     							    	self.find('.ofile-msg').text(  "正在上传..."  );//信息显示
     							    },
     							    complete:function(){
     					 				
     							    }  
     							});
     		          		}else{
     		          			self.find('.ofile-msg').text(  "请重新选择文件,大小不能超过2MB"  );//信息显示
     		          		}	

               		}


     	          	//可重复选择文件处理
     	          	jQuery(this).after(  jQuery(this).clone()   );//克隆当前元素
     	          	jQuery(this).remove();//删除当前元素

               })             
                        
          };       
})(jQuery, window, document);
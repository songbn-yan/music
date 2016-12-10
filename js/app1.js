$(document).ready(function(){
	var audio=$("#audio").get(0);
	var play=$("#play");
	var pause=$("#pause");
	var bf=$("#bf");
	var last=$("#last");
	var next=$("#next");
	var progress=$("#progress");
	var pi=$("#p-i");
	var volume=$("#volume");
	var vi=$("#v-i");
	var mute=$("#mute");
	var current=$("#current-time");
	var duration=$("#duration");
	
	
    //转换时间格式
    function time(v){
		v = Math.floor(v)
		var s= v % 60;
		s = s < 10 ? ("0"+s ):s ;
		var z= Math.floor(v / 60)
		return z+":"+s;
	}
	
	audio.oncanplay=function(){
		duration.html(time(audio.duration))
	}
	
	
	
	
	//歌曲进度条拖拽
//	pi.on("mousedown",function(e){
//		var r=pi.width()/2;
//		var start= r - e.offsetX;
//		$(document).on("mousemove",function(e){
//			var left=e.clientX - progress.position().left +start;
//			console.log(left)
//			var c= left/progress.width()*audio.duration;
//			audio.currentTime =c;				
//		})
//		return false;
//	})
//	$(document).on("mouseup",function(){
//		$(document).off("mousemove")
//	})


	pi.on("touchstart",false)
	pi.on("touchstart",function(e){
		console.log(1)
		var offsetX=e.originalEvent.changedTouches[0].clientX -pi.offset().left;
		var ir=pi.width()/2;
		console.log(ir)
		console.log(offsetX)
		
		var start= ir - offsetX;
		console.log(start)
		console.log(progress.position().left)
		
		$(document).on("touchmove",function(e){
			console.log(e.originalEvent.changedTouches[0].clientX)
			var left=e.originalEvent.changedTouches[0].clientX - progress.offset().left +start;
			console.log(left)
			var c= left/progress.width()*audio.duration;
			if(c>=audio.duration || c<=0){
				return;
			}
			console.log(c)
			audio.currentTime =c;	
			
		})
		return false;
	})
	$(document).on("touchend",function(){
		$(document).off("touchmove")
	});
	
	progress.on("touchend",false)
	progress.on("touchend",function(e){
		var ir=pi.width()/2;
		var offsetX=e.originalEvent.changedTouches[0].clientX -progress.offset().left;
		audio.currentTime=offsetX/progress.width()*audio.duration;
		console.log(audio.currentTime)
		console.log(offsetX)
		console.log(progress.width())
		console.log(audio.duration)
    });
	
	
	
	//歌曲快进
    $(audio).on("timeupdate",function(){
		current.html(time(audio.currentTime));
		var left= progress.width()* audio.currentTime /audio.duration;
		pi.css("left",left);
	})
    pi.on("click",false);
    vi.on("click",false);
    
    
    
   	//播放和暂停
	play.on("click",function(){      
		if(audio.paused){
			audio.play();
		}else{
			audio.pause();
		}			
	})	
	$(audio).on("play",function(){
		bf.html("&#xe615;");
	});
    $(audio).on("pause",function(){
    	bf.html("&#xe609;");
    });
    
    
    
    
    //列表
	var index=0;
	var music=[{name:"老街",zuozhe:"李荣浩",src:"mp3/李荣浩-老街 (Live).mp3",duration:"5:18"},
	{name:"模特",zuozhe:"李荣浩",src:"mp3/李荣浩-模特.mp3",duration:"5:06"},
	{name:"演员",zuozhe:"薛之谦",src:"mp3/薛之谦-演员.mp3",duration:"4:21"}]
	
	//添加歌曲列表
	
	function add(){
		$("#uls").empty();
		$.each(music,function(i,v){	
			var c = ( i === index ) ? "active" : "";
			$('<li class="'+c+'"><span class="names">'+music[i].name+'-'+music[i].zuozhe+'</span><a class="delete" href="javascript:;">删除</a></li>').appendTo("#uls");
			 $(music[index].lyrics).each(function(i,v){
	            $("<p class="+ i +">"+v.lyric+"</p>").appendTo("#lyric .lyric-box .lyric")
	       })		
			
		})
	}
	add();
	
	//删除列表 
	$("#uls").on('touchend','.delete',function(){
		var li = $(this).closest('li');
		var indexs = li.index();
		music.splice(indexs,1);
		
		if (indexs === index) {
			if(music[indexs]) {
				audio.src=music[index].src;
			} else {
				audio.src= '';
			}
		} else if (indexs > index){
				   //不操心
			} else if (indexs < index){
				index -= 1;
			}
			
		add();
		audio.play();
		return false;
	});
	
	//切换歌曲
	
	$("#uls").on("touchend","span",function(){
		
		index=$(this).closest('li').index();
		audio.src=music[index].src;
	 	var ins=index+1;
		audio.play();
		add();
	})
	
	
	//点击头部右边按钮出现左边消失列表
    var right=$("#right");
    var left=$("#left");
	var s=$("#music-list");
	right.on("click",function(){
		s.css("display","block");
	})
	left.on("click",function(){
		s.css("display","none")
	})

//  $(function(){
//	var right=$("#right"); 
//	right.on("click",function(){
//		$("music-list").toggle();
//	})
//})
    
    //上一首
    last.on("click",function(){
		var indexs=index-1;
		if(indexs<0){
			indexs=2;
		}
		$('#uls').find("li").removeClass("active");
		$('#uls').find("li").eq(indexs).addClass("active")
		
		audio.src=music[indexs].src;
		audio.play();
		
		index=indexs;
	})
    
    
    //下一首
    next.on("click",function(){
		var indexs=index+1;
		if(indexs>=music.length){
			indexs=0;
		}
		$('#uls').find("li").removeClass("active");
		$('#uls').find("li").eq(indexs).addClass("active")
		
		audio.src=music[indexs].src;
		audio.play();
		
		index=indexs;
	})
    

	//音量进度条拖拽
//	vi.on("mousedown",function(e){
//		var r=vi.width()/2;
//		var start= r - e.offsetX;
//		$(document).on("mousemove",function(e){
//			var left=e.clientX - volume.position().left +start;
//			var x= left/volume.width();
//			audio.volume =x;	
//			
//		})
//		return false;
//	})
//	$(document).on("mouseup",function(){
//		$(document).off("mousemove");
//	})
//	$(audio).on("volumechange",function(){
//		
//		var left= volume.width()* audio.volume-vi.width()/2;
//		console.log(vi.width)
//		vi.css("left",left+'px');
//	})
//	
//	
//	volume.on("click",function(e){
//		audio.volume=e.offsetX/volume.width();
//		mute.removeAttr("v");
//	});

	vi.on('touchstart',false)
	vi.on("touchstart",function(e){
		var offsetX  = e.originalEvent.changedTouches[0].clientX - vi.offset().left;
		var r=vi.width()/2;
		var start= r - e.offsetX;
		$(document).on("touchmove",function(e){
			var pos = e.originalEvent.changedTouches[0].clientX - volume.offset().left + start;	
			var v = pos/volume.width()
			if( v >=1 || v <=0 ){
				return;
			}
//			audio.volume = v;
		})
		return false;
	})
	$(document).on("touchend",function(){
		$(document).off("touchmove");
	})
	$(audio).on("volumechange",function(){
		vi.css("left",volume.width() * audio.volume - vi.width()/2 +"px") ;
		$("#volume .right .this").css("width",volume.width() * audio.volume - vi.width()/2 +"px")
	})
	
	
	volume.on("touchend",function(e){
		var offsetX = e.originalEvent.changedTouches[0].clientX - volume.offset().left;
		console.log(offsetX)
		audio.volume = offsetX / $(this).width();
		mute.removeAttr("v");
	});
	
	
	
	//静音
	mute.on("click",function(){
		if($(this).attr("v")){
			audio.volume=$(this).attr("v");
			$(this).removeAttr("v")
			
		}else{
			$(this).attr("v",audio.volume)
			audio.volume=0;
		}
		
	})
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
})

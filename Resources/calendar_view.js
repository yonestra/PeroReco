//calendar_view.js

var win = Ti.UI.currentWindow;

var now = new Date();
now.setHours(12);
var Y = now.getYear()+1900;
var M = now.getMonth()+1;

var whenLabel = Ti.UI.createLabel({
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:20
	},
	textAlign:'center',
	text:Y+"年"+M+"月",
	top:7, left:'auto', height:25, width:'auto'
});
win.add(whenLabel);

var backMonthButton = Ti.UI.createLabel({
	backgroundColor:"#transparent",
	top:7, left:30, height:25, width:50,
	textAlign:'center',
	text:'＜＜'
});
backMonthButton.addEventListener('click', function(){
	var date = new Date(Y,parseInt(M)-1-1)
	Y = date.getYear()+1900;
	M = date.getMonth()+1;
	whenLabel.text = Y+"年"+M+"月";
	win.remove(scrollView);
	cal(date);
});
win.add(backMonthButton);
var forwardMonthButton = Ti.UI.createLabel({
	backgroundColor:"#transparent",
	top:7, left:240, height:25, width:50,
	textAlign:'center',
	text:'＞＞'
});
forwardMonthButton.addEventListener('click', function(){
	var date = new Date(Y,parseInt(M)-1+1)
	Y = date.getYear()+1900;
	M = date.getMonth()+1;
	whenLabel.text = Y+"年"+M+"月";
	win.remove(scrollView);
	cal(date);
});
win.add(forwardMonthButton);

var scrollView;
// var tmpView;
var cal = function(date){
	scrollView = Titanium.UI.createScrollView({
		contentWidth:'auto',
		contentHeight:'auto',
		top:40,//70
		height:330,
		width:320,
		backgroundImage:'images/bg_paper.jpg'
		// backgroundColor:'#transparent'
	});
	win.add(scrollView);
	var tmpView = Titanium.UI.createView({
		top:0,//70
		height:'auto',
		width:'auto',
		backgroundColor:'#transparent'
	});

	var year = date.getFullYear();
	var month = date.getMonth();
	
	var leap_year=false;
 	if ((year%4 == 0 && year%100 != 0) || (year%400 == 0)) leap_year=true;
	var lom = new Array(31,28+leap_year,31,30,31,30,31,31,30,31,30,31);
	var w = new Array("red","gray","gray","gray","gray","gray","blue");
	var days=0;
	for (var i=0; i < month; i++) days+=lom[i];
	var week=Math.floor((year*365.2425+days)%7);
	var cols = 0;
	var rows = 0;
	var width = 80;
	var height = 80;
	var YYYY = year;
	var MM = month + 1;
	// var tmpView = Ti.UI.createView({
		// top:0, left:0, height:'auto', width:'auto'
	// });
	Ti.API.info("year:"+year+" month:"+month);
	if(String(MM).length == 1) MM = "0"+MM;
	for(var i=0; i<lom[month]; i++){
		var top = 0 + height * rows;
		var left = 0 + width * cols;
		var DD = i+1;
		var d = new Date(year, month, DD);
		var calView = Ti.UI.createView({
			// backgroundColor:w[week],
			backgroundColor:"#transparent",
			// borderColor:"black",
			borderColor:w[week],
			top:top, left:left, height:height, width:width,
			date:d
		});
		calView.addEventListener('click', function(e){
			// var record = records[e.index];
			// record.index = e.index;
			var inputWindow = Ti.UI.createWindow({
				url: 'input_window.js',
				// record: record,
				func: 'update_row',
				title:'Input',
		    	barColor:'#brown',
				backgroundColor:'#fff',
				date:this.date
			});
			Ti.UI.currentTab.open(inputWindow);
		});
		// scrollView.add(calView);
		tmpView.add(calView);
		if(String(DD).length == 1) DD = "0"+DD;
		var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, YYYY+MM+DD + ".png");
		// Ti.API.info("applicationDataDirectory:"+Titanium.Filesystem.applicationDataDirectory);
		if(f.exists()){
			Ti.API.info("f"+i+" : "+f.read());
			var dayImage = Ti.UI.createImageView({
				width:width,
				height:height,
				image:f.read(),
				date:d
			});
			// calView.backgroundImage = f.read();
			calView.add(dayImage);
		} else {
			Ti.API.info("f"+i+" : "+YYYY+MM+DD + ".png");
			var dayLabel = Ti.UI.createLabel({
				color:'black',
				font:{fontSize:12},
				width:'auto', height:'auto',
				// textAlign:'center',
				text:i+1,
				date:d,
				top: 5, left: 5
			});
			// Ti.API.info("f"+i+" : "+dayLabel);
			calView.add(dayLabel);
		}
		if(cols != 3){
			cols++;
		} else {
			cols = 0;
			rows++;
		}
		if(week != 6){
			week++;
		} else {
			week = 0;
		}
	}
	scrollView.add(tmpView);
}

win.addEventListener('focus', function(){
	cal(now);
});

//設定ボタン
var cameraButton = Ti.UI.createButton({
	systemButton: Titanium.UI.iPhone.SystemButton.CAMERA
});
cameraButton.addEventListener('click', function () {
	// Titanium.Media.showCamera({
	    // // JSON形式の引数です
	    // success:function(event){
	        // // cropRectにはx,y,height,widthといったデータがはいる。
	        // var cropRect = event.cropRect;
	        // var image    = event.media;
// 	
	        // // 撮影されたデータが写真ならばImageViewとしてWindowに貼り付ける
	        // if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
	            // var imageView = Ti.UI.createImageView({
	                // width:win.width,
	                // height:win.height,
	                // image:event.media
	            // });
	            // win.add(imageView);  
	        // }
// 	        
	        // // アプリケーションデータディレクトリに camera_photo.png として出力する。
			// var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory,'camera_photo.png');
			// f.write(event.image);
// 			
			// // 現在のウィンドウ背景画像としてそのまま使う場合は次のようにする
			// // Titanium.UI.currentWindow.backgroundImage = f.nativePath;
	    // },
	    // cancel:function(){
	        // // ...
	    // },
	    // error:function(error){
	        // // errorとしてカメラがデバイスにないようなケース(iPod touchなどがそうでしょうか)では
	        // // error.code が Titanium.Media.NO_CAMERA として返ります。
	    // },
	    // // 撮影データのフォトギャラリーへの保存
	    // saveToPhotoGallery:true,
	    // // 撮影直後に拡大縮小移動をするか否かのフラグ
	    // allowEditing:true,
	    // // 撮影可能なメディア種別を配列で指定
	    // mediaTypes:[Ti.Media.MEDIA_TYPE_VIDEO,Ti.Media.MEDIA_TYPE_PHOTO],
    // });
    
    Titanium.Media.openPhotoGallery({
	    success: function(event) {
	    	// cropRectにはx,y,height,widthといったデータがはいる。
	        // var cropRect = event.cropRect;
	        // var image    = event.media;
	
	        // 取得したデータが写真ならばImageViewとしてWindowに貼り付ける
	        // if(event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO){
	            // var imageView = Ti.UI.createImageView({
	                // width:win.width,
	                // height:win.height,
	                // image:event.media
	            // });
	            // win.add(imageView);  
	        // }
	        
	        // アプリケーションデータディレクトリに出力する。
	        var now = new Date();
	        now.setHours(12);
			var YYYY = now.getYear()+1900;
			var MM = now.getMonth()+1;
			var DD = now.getDate();
			if(String(MM).length == 1) MM = "0"+MM;
			if(String(DD).length == 1) DD = "0"+DD;
			var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, YYYY+MM+DD+'.png');
			if (!f.exists()) {
				Ti.API.info("create new file!");
				f.createFile();
			}
			// Ti.API.info("f.path:"+f.path);
			f.write(event.media);
			Ti.API.info("f.read:"+f.read());
			cal(now);
	    },
	    error: function(error) {
	        // notify(e.message);
	    },
	    cancel: function() {
	        // キャンセル時の挙動
	    },
	    // 撮影データのフォトギャラリーへの保存
    	// saveToPhotoGallery:true,
	    // 選択直後に拡大縮小移動をするか否かのフラグ
	    allowEditing: true,
	    // 選択可能なメディア種別を配列で指定
	    mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO]
	});
	
	// //デバイス画面をカメラ同様に取り込める　キャラのキャプチャに使える？
	// Titanium.Media.takeScreenshot(function(event){
	    // var image = event.media;
	    // var imageView = Ti.UI.createImageView({image:event.media});
    	// Ti.UI.currentWindow.add(imageView);
	// });
});
win.rightNavButton = cameraButton;
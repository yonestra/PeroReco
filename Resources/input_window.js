var win = Ti.UI.currentWindow;

var now = win.date;
now.setHours(12);
var Y = now.getYear()+1900;
var M = now.getMonth()+1;
var D = now.getDate();
if(String(M).length == 1) M = "0"+M;
if(String(D).length == 1) D = "0"+D;
var y_m_d = parseInt(Y+""+M+""+D);

// var photoView = Titanium.UI.createLabel({
	// top:30, left:100, height:100, width:100
// });
// win.add(photoView);

var whenLabel = Titanium.UI.createLabel({
	color:'#black',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:20
	},
	textAlign:'center',
	top:5, left:'auto', height:'auto', width:'auto'
});
whenLabel.text = Y + "年" + M + "月" + D + "日";
win.add(whenLabel);

//
// meat SLIDER
//

var meatSlider = Titanium.UI.createSlider({
	backgroundDisabledColor:'#orange',
	min:0,
	max:10,
	top:210, left:50, right:60, height:'auto',
	thumbImage:'images/meat.png',
	highlightedThumbImage:'images/meat.png'
});
var meatSliderLabel = Titanium.UI.createLabel({
	text:'0' ,
	color:'#orange',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:20
	},
	textAlign:'center',
	top:meatSlider.top, right:30, height:'auto', width:25
});
meatSlider.addEventListener('change',function(e)
{
	meatSliderLabel.text = Math.round(e.value);
});
meatSlider.value = 0; // For regression test purposes
win.add(meatSliderLabel);
win.add(meatSlider);

//
// vegetable SLIDER
//
var vegetableSlider = Titanium.UI.createSlider({
	backgroundDisabledColor:'#orange',
	min:0,
	max:10,
	top:meatSlider.top+50, left:50, right:60, height:'auto',
	thumbImage:'images/vegetable.png',
	highlightedThumbImage:'images/vegetable.png'
});
var vegetableSliderLabel = Titanium.UI.createLabel({
	text:'0' ,
	color:'#orange',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:20
	},
	textAlign:'center',
	top:vegetableSlider.top, right:30, height:'auto', width:25
});
vegetableSlider.addEventListener('change',function(e)
{
	vegetableSliderLabel.text = Math.round(e.value);
});
vegetableSlider.value = 0; // For regression test purposes
win.add(vegetableSliderLabel);
win.add(vegetableSlider);

//
// carb SLIDER
//
var carbSlider = Titanium.UI.createSlider({
	backgroundDisabledColor:'#orange',
	min:0,
	max:10,
	top:vegetableSlider.top+50, left:50, right:60, height:'auto',
	thumbImage:'images/carb.png',
	highlightedThumbImage:'images/carb.png'
});
var carbSliderLabel = Titanium.UI.createLabel({
	text:'0',
	color:'#orange',
	font:{
		fontFamily:'Helvetica Neue',
		fontSize:20
	},
	textAlign:'center',
	top:carbSlider.top, right:30, height:'auto', width:25
});
carbSlider.addEventListener('change',function(e)
{
	carbSliderLabel.text = Math.round(e.value);
});
carbSlider.value = 0; // For regression test purposes
win.add(carbSliderLabel);
win.add(carbSlider);

var saveButton = Ti.UI.createButton({
	title: 'Save'
});
win.rightNavButton = saveButton;

// saveButton.addEventListener('singletap',function(){
	// this.backgroundColor = "#blue";
// });

saveButton.addEventListener(
'click', function () {
	Titanium.API.info("click saveButton!:"+win.func);
	this.backgroundGradient = {
    	type:'linear',
    	colors:[
	        {position:0.00,color:'#white'},
	        {position:0.50,color:'#blue'},
	        {position:0.51,color:'#blue'},
	        {position:1.00,color:'#white'}
	    ],
	    startRadius:{x:0,y:0},
	    endRadius:{x:50,y:50}
   	}
   	
   	this.backgroundGradient = {
    	type:'linear',
    	colors:[
        	{position:0.00,color:'#feccb1'},
        	{position:0.50,color:'#f17432'},
        	{position:0.51,color:'#ea5507'},
        	{position:1.00,color:'#fb955e'}
        ],
        startRadius:{x:0,y:0},
        endRadius:{x:50,y:50}
   	}
	
	var record = {};
	// record.index = win.record.index;
	record.meat_val = Math.round(meatSlider.value);
	record.vegetable_val = Math.round(vegetableSlider.value);
	record.carb_val = Math.round(carbSlider.value);
	record.y_m_d = y_m_d_old;
	record.created_at = new Date();
	record.created_at.setHours(12); //日付がなぜかズレるのを防止c, record);
	record.updated_at = new Date();
	record.updated_at.setHours(12); //日付がなぜかズレるのを防止c, record);
	Ti.App.fireEvent(win.func, record);
	// if(win.func == "update_row") win.close();
	
	if ( Ti.Facebook.loggedIn ) {
		// if ( Ti.Facebook.loggedIn && win.func == "insert_row") {
		var message = "meat:"+record.meat_val
						+", vegetable:"+record.vegetable_val
						+", carb:"+record.carb_val;
        Ti.Facebook.requestWithGraphPath(
	        'me/feed',
	        {
	             message: message
	        },
	        "POST",
	        function(e) {
	            if (e.success) {
	                alert("Success" + e.result);
	            }
	        }
	    );
    }
    win.close();
});

Ti.App.addEventListener('insert_row', function(record) {
	Titanium.API.debug("insert_row");
	insertCallback(record);
});

function insertCallback(record) {
	db.insert(record);
	// records = db.findAll();
	// updateRecord(records);
}

Ti.App.addEventListener('update_row', function(record) {
	Titanium.API.debug("update_row");
	updateCallback(record);
});

function updateCallback(record) {
	// db.update(record)
	db.updateByYMD(record)
	// records = db.findAll();
	// updateRecord(records);
}


Titanium.include("lib/date.js");

function getData(record){
	if(record != null){
		win.func = "update_row";
		meatSliderLabel.text = record.meat_val;
		meatSlider.value = record.meat_val;
		vegetableSliderLabel.text = record.vegetable_val;
		vegetableSlider.value = record.vegetable_val;
		carbSliderLabel.text = record.carb_val;
		carbSlider.value = record.carb_val;
	} else {
		win.func = "insert_row";
		meatSliderLabel.text = 0;
		meatSlider.value = 0;
		vegetableSliderLabel.text = 0;
		vegetableSlider.value = 0;
		carbSliderLabel.text = 0;
		carbSlider.value = 0;
	}
	var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, y_m_d + ".png");
	// Ti.API.info("applicationDataDirectory:"+Titanium.Filesystem.applicationDataDirectory);
	if(f.exists()){
		Ti.API.info("f : "+y_m_d + ".png");
		var dayImage = Ti.UI.createImageView({
			width:120, height:120,
			image:f.read()
		});
		// calView.backgroundImage = f.read();
		photoView.add(dayImage);
	} else {
		var noneLabel = Ti.UI.createLabel({
			color:'white',
			font:{
				fontFamily:'Helvetica Neue',
				fontSize:25
			},
			textAlign:'center',
			height:'auto', width:'auto',
			text:"撮る"
		});
		photoView.add(noneLabel);
	}
}

var photoView = Ti.UI.createView({
	top:50, left:100, height:120, width:120,
	backgroundColor:"gray"
});
photoView.addEventListener('click', function () {
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
	        // アプリケーションデータディレクトリに出力する。
			var f = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory, y_m_d+'.png');
			if (!f.exists()) {
				Ti.API.info("create new file!");
				f.createFile();
			}
			f.write(event.media);
			var record = db.findOneByYMD(y_m_d);
			getData(record);
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
win.add(photoView);

Ti.include('record_db.js');
var db = new RecordDB();

win.addEventListener('focus', function(){
	var record = db.findOneByYMD(y_m_d);
	getData(record);
});


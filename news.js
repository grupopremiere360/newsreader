#!/usr/bin/gjs
const Lang = imports.lang;
const Gtk = imports.gi.Gtk;
const Gdk = imports.gi.Gdk;
const Gio = imports.gi.Gio;
const Pango = imports.gi.Pango;
const WebKit = imports.gi.WebKit;

const Application = new Lang.Class({
    Name: 'Application',
    MIN_CONTENT_WIDTH: 400,
    MIN_CONTENT_HEIGHT: 300,	
    PATH_CSS: 'file:///home/gp360/Desktop/app-gtk/news/prototype.css',
    JSON_FILE: 'my.json',
    TEXT_BTN_BACK : 'Regresar a todas las noticias',
    TEXT_BTN_MORE : 'Ver mas',
    PATH_IMGS : '/home/gp360/Desktop/app-gtk/news/img/',
    PATH_FILE : '/home/gp360/Desktop/app-gtk/news/',
    //create the application
    _init: function() {
        this.application = new Gtk.Application();

        //connect to 'activate' and 'startup' signals to handlers.
        this.application.connect('activate', Lang.bind(this, this._onActivate));
        this.application.connect('startup', Lang.bind(this, this._onStartup));
    },

    //create the UI
    _buildUI: function() {

        this._window = new Gtk.ApplicationWindow({ application: this.application,
                                                   title: "Prototipo V.1.0" });
        this._window.fullscreen();

        //Init style context
        let provider = new Gtk.CssProvider();
        let css_file = Gio.File.new_for_uri(this.PATH_CSS);
        provider.load_from_file(css_file);

        Gtk.StyleContext.add_provider_for_screen(Gdk.Screen.get_default(),
            provider,
            Gtk.STYLE_PROVIDER_PRIORITY_APPLICATION);

       /*
        * Stack and frames 
        */

        this.list =  new Gtk.Frame({"border-width":0});
        this.detail =  new Gtk.Frame({"border-width":0});

        this.stack = new Gtk.Stack({
            homogeneous: true,
            transition_duration: 100,
            transition_type: Gtk.StackTransitionType.SLIDE_LEFT,
	        width_request: this.MIN_CONTENT_WIDTH,
            height_request: this.MIN_CONTENT_HEIGHT,
        });
        
        this.stack.add(this.list);
        this.stack.add(this.detail);
        
        this.detail.get_style_context().add_class('detail');
        this.list.get_style_context().add_class('list');

       /*
        * elements in frame list
        */

        let listScrollWindow = new Gtk.ScrolledWindow();
        let vboxParent = new Gtk.VBox();

        let vboxBlank = new Gtk.VBox();
        vboxBlank.set_size_request(300, 350);

        let exitButton = new Gtk.Button({ label: " X " });
        exitButton.set_size_request(20,20);
        exitButton.connect('clicked',Lang.bind(this,this._exit));
        exitButton.get_style_context().add_class('exit');
        
        let align = new Gtk.Alignment({xalign: 1.0, yalign: 0.0, 
                                           xscale: 0.0, yscale: 0.0});
        align.add(exitButton);
        vboxBlank.add(align);

        vboxParent.add(vboxBlank);

        vboxParent.get_style_context().add_class('vbox');
        this.arrayData = load_file(this.JSON_FILE);

        let mainGrid = new Gtk.Grid({
            "column-homogeneous": true
        });

        let c = 0;
        let f = 0;
        
        for (var i = 0; i < this.arrayData.length; i++){
            mainGrid.attach(this._make_block(this.arrayData[i]), c, f, 1, 1);
            if (c == 0){
                c++;
            }else{
                c = 0;
                f++;
            }
        }

        mainGrid.get_style_context().add_class('grid');

        vboxParent.add(mainGrid);

        listScrollWindow.add_with_viewport(vboxParent);

        this.list.add(listScrollWindow);

       /*
        * elements in frame detail
        */

        this.scrolledWindowDetail = new Gtk.ScrolledWindow();   

        let veticalBoxDetail  = new  Gtk.VBox({homogeneous: false, spacing:15});
        let btnBack = new Gtk.Button({ label: this.TEXT_BTN_BACK });
        btnBack.set_size_request(20,10);
        btnBack.connect('clicked',Lang.bind(this,this._showList));

        let alignmentSetting = new Gtk.Alignment({xalign: 1.0, yalign: 0.0,
                                                  xscale: 0.0, yscale: 0.0});
        alignmentSetting.add(btnBack);

        veticalBoxDetail.pack_start(alignmentSetting, false, false, 0);	

        this.titleDetail = new Gtk.Label({ label: "" });
        veticalBoxDetail.add(this.titleDetail);
        this.titleDetail.get_style_context().add_class('title');
        this.titleDetail.set_line_wrap(true);

        this.imageDetail = new Gtk.Image();
        this.imageDetail.set_from_file(null);
        veticalBoxDetail.add(this.imageDetail);

        this.contentWebViewDetail = new WebKit.WebView();
        this.contentWebViewDetail.load_html_string("","");
	
        veticalBoxDetail.add(this.contentWebViewDetail);

        this.scrolledWindowDetail.add_with_viewport(veticalBoxDetail);

        listScrollWindow.set_vadjustment(new Gtk.Adjustment ({
            value: 100,
            lower: 0,
            upper: 100,
            step_increment: 0,
            page_increment: 0 }));

        this.detail.add(this.scrolledWindowDetail);
        this._window.add(this.stack);
    },

    //handler for 'activate' signal
    _onActivate: function() {
        //show the window and all child widgets
        this._window.show_all();
    },

    //handler for 'startup' signal
    _onStartup: function() {
        this._buildUI();
    },
    
    //show detail of news
    _showDetail: function(json){
        this.scrolledWindowDetail.set_vadjustment(new Gtk.Adjustment ({
            value: 100,
            lower: 0,
            upper: 0,
            step_increment: 0,
            page_increment: 0 }));

        this.stack.transition_type = Gtk.StackTransitionType.SLIDE_LEFT;
        this.stack.visible_child = this.detail;
        
        this.titleDetail.set_text(json.title);
        this.imageDetail.set_from_file("img/"+json.content_image);
        this.contentWebViewDetail.load_html_string(json.content,"");
    },
    
    //show list news
    _showList: function(){	
        this.stack.transition_type = Gtk.StackTransitionType.SLIDE_RIGHT;
        this.stack.visible_child = this.list;
    },
    
    //make block item
    _make_block : function (json) {
        
    // The text styling for the heading is done with simple Pango markup.
        let titleArticle = json.title;
        let heading = new Gtk.Label({"label": "  " + titleArticle + "                        "});
        heading.set_ellipsize(Pango.EllipsizeMode.END);
        heading.set_line_wrap_mode(Pango.WrapMode.CHAR);
        heading.set_max_width_chars(40);
        heading.get_style_context().add_class('title');
        
        // WebView for Description
        let webViewDescription = this._set_description_webView(json.title);

        // Webview for Image
        let webViewImage = this._set_image_webView(json.content_image);

        let grid = new Gtk.Grid();
        grid.set_size_request(500, 200);
        
        let buttonShow = new Gtk.Button({label: this.TEXT_BTN_MORE});
        buttonShow.connect('clicked',this._showDetail.bind(this,json));
        buttonShow.set_size_request(100,50);
        buttonShow.get_style_context().add_class('button');

        let alignmentSetting = new Gtk.Alignment({xalign: 1.0, yalign: 0.0,
                                                  xscale: 0.0, yscale: 0.0});

        alignmentSetting.add(buttonShow);

        grid.attach (webViewImage, 0, 0, 3, 3);
        grid.attach (heading, 3, 0, 8, 1, Gtk.AttachOptions.SHRINK | Gtk.AttachOptions.FILL);
        grid.attach (webViewDescription, 3, 1, 8, 1);
        grid.attach (alignmentSetting, 9, 2, 2, 1);
        grid.get_style_context().add_class('item');

        return grid;
    },
    
    //Exit aplication
    _exit: function(){
        this._window.destroy();
    },
    
    //set image webview in item notice
    _set_image_webView: function(imageTest){

        let style_div = "position:relative; overflow:hidden;width:115px; height:115px";
        let style_picture = "position:absolute; left:auto; right:auto";
                             
        let webViewImage = new WebKit.WebView();
        let htmlImage = '<div style="'+ style_div +'"><img height="100%" style="'+ style_picture +'" src="'+ this.PATH_IMGS + imageTest+'"/></div>';
        webViewImage.load_html_string(htmlImage, 'file:///');
        return webViewImage;
    },
    
    //set description webview in item notice
    _set_description_webView: function(title){
        var webViewDescription = new WebKit.WebView();
        webViewDescription.load_html_string(title, '');
        return webViewDescription;
    },
});

function load_file (filename){
        let input_file = Gio.file_new_for_path("/home/gp360/Desktop/app-gtk/news/" + filename);
        let size = input_file.query_info(
            "standard::size",
            Gio.FileQueryInfoFlags.NONE,
            null).get_size();
        let stream = input_file.open_readwrite(null).get_input_stream();
        let data = stream.read_bytes(size, null).get_data();
        stream.close(null);
        return JSON.parse(data);
}

//run the application
let app = new Application();
app.application.run(ARGV);

# Stacky
Stacky is a jQuery plugin that gives you the ability to open panels horizontally, as you need them. Panels can be opened and closed, and also expanded and collapsed. A panel can be optionally opened as a floating panel, meaning it is not pushed at the end but next to an specific panel. Additionally, the open and close events can optionally call functions to set or retrieve data to/from panels.

## Installation

The plugin requires jQuery 1.7 or higher.

Via [npm](https://www.npmjs.com/package/jquery.stacky):

```
npm install jquery.stacky
```

Via [bower](https://github.com/jachinte/jquery.stacky/blob/master/bower.json)

```
bower install jquery.stacky
```

### Downloading Manually

If you want the latest stable version, get the latest release from the [releases](https://github.com/jachinte/jquery.stacky/releases) page.

## Usage

Include the jQuery library, the stacky plugin and its CSS styles. These files can be found in the [dist/](dist/) folder.
```html
<script src="path/to/jquery.js"></script>
<script src="path/to/jquery.stacky.min.js"></script>
<link rel="stylesheet" type="text/css" href="path/to/jquery.stacky.css" />
```

Then, initialize the plugin in the element that will hold the panels:

```javascript
$( document ).ready(function() {
    var default_options = { ... };
    var container  = $( '#container' ).Stacky( default_options );
});
```

To push in a new panel use the push method:

```javascript
var panel_options = { ... };
container.data( 'Stacky' ).push( panel_options );
```

#### AMD

Stacky can also be used with [require.js](http://requirejs.org/). You can find an example in [demo/basic-requirejs.html](demo/basic-requirejs.html).

## Options

Options can be set either in the plugin initialization or when pushing in a new panel.

### Plugin initialization options

__fadeInSpeed__: Integer | 'fast' | 'slow'  
The fade in speed (in milliseconds when it's an integer) when making a new panel visible.

__scrollToSpeed__: Integer | 'fast' | 'slow'  
The speed (in milliseconds when it's an integer) with which the scroll bar moves when adding, expanding or collapsing panels.

__panelDefaults__: Object  
An object containing default options to be applied to all new panels. These are the same *Panel pushing options* described in the next subsection.

### Panel pushing options

__after__: jQuery object    
If different than undefined, the new panel is inserted after this jQuery element (a panel).

__content__: string    
HTML to be inserted into the panel.

__floating__: boolean  
Indicates if the new panel should be placed after the 'after' panel [true] or after the other panels (at the end) [false]

__id__: string    
The id attribute of the new panel.

__class__: string    
The class attribute of the new panel. The CSS styles include the helper classes `thin`, `regular`, `medium`, and `wide` to set the panel's width. The `expaned` class can be configured in the CSS to control the expand behavior (default width is 100%)

__onBeforeOpen__: function ( $panel )    
It's called before fading in the new panel.

__onBeforeClose__: function ( $panel )    
It's called before hiding and removing the panel. To indicate that the panel must remain opened, a false value should be returned.

## Util methods

These are utility functions built-in within the plugin. The usage is similar to the `push` method.

__closeActivePanel__: function (  )    
Closes the current active panel (or panels holding the `active` class)

__highlightPanel__: function ( $panel )    
Highlights the given panel. This simply shows a left and right shadow for 1 second.

## Theming

Stacky panels come with the minimum styling. If you want to customize the appereance you can modify the styles in [src/sass/styles.scss](src/sass/styles.scss), and then re-run the grunt command to generate the distribution files again. With minimum effort you can get panels such as these:

![White theme](https://cloud.githubusercontent.com/assets/1284036/6249774/6e0854ae-b757-11e4-81a9-7b89d6bdbb9b.png)

## Contributing

You are invited to contribute code and suggestions to this project. The more the merrier.

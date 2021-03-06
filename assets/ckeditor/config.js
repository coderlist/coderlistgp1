/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here.
	// For complete reference see:
	// http://docs.ckeditor.com/#!/api/CKEDITOR.config

	// The toolbar groups arrangement, optimized for two toolbar rows.
	config.toolbarGroups = [
		{ name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
		{ name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
		{ name: 'links' },
		{ name: 'insert' },
		{ name: 'forms' },
		{ name: 'tools' },
		{ name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'others' },
		'/',
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
		{ name: 'styles' },
		{ name: 'colors' },
		{ name: 'about' }
	];

	// Remove some buttons provided by the standard plugins, which are
	// not needed in the Standard(s) toolbar.
	config.removeButtons = 'Underline,Subscript,Superscript,Preview,Indent,Outdent,About';

	// Set the most common block elements.
	config.format_tags = 'p;h1;h2;h3;pre';

	config.removePlugins = 'image';

	// Simplify the dialog windows.
	config.extraPlugins = 'justify,image2,widget,lineutils';
	config.filebrowserBrowseUrl = '/users/upload-file';
	config.filebrowserUploadUrl = '/users/upload-file';
	config.imageUploadUrl = '/users/upload-file';
	config.uploadUrl = '/users/upload-file';
	config.imageBrowser_listUrl = '/users/get-server-images';
	config.contentsCss = '/ckeditor/editor-styles.css';
	config.autoParagraph = false;
	config.allowedContent = true;

	config.image2_alignClasses = [ 'image-left', 'image-center', 'image-right' ];
	config.image2_captionedClass = 'image-captioned'; 
};

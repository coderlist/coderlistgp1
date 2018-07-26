/**
 * Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// This file contains style definitions that can be used by CKEditor plugins.
//
// The most common use for it is the "stylescombo" plugin which shows the Styles drop-down
// list containing all styles in the editor toolbar. Other plugins, like
// the "div" plugin, use a subset of the styles for their features.
//
// If you do not have plugins that depend on this file in your editor build, you can simply
// ignore it. Otherwise it is strongly recommended to customize this file to match your
// website requirements and design properly.
//
// For more information refer to: https://docs.ckeditor.com/ckeditor4/docs/#!/guide/dev_styles-section-style-rules

CKEDITOR.stylesSet.add( 'default', [
	
	/* Block styles */

	{
		name: 'Image Grid',
		element: 'div',
		attributes: { 'class': 'image-grid' }
	},

	/* Table styles */

	{
		name: 'Alt Table',
		element: 'table',
		attributes: {
			'class': 'table-alt'
		}
	},

	/* Format styles */

	{ name: 'Square Bulleted List',	element: 'ul',	styles: { 'list-style-type': 'square' } },

	/* Image styles */

	{ name: 'Grayscale Image', type: 'widget', widget: 'image', attributes: { 'class': 'image-grayscale' } },
	{ name: 'Sepia Image', type: 'widget', widget: 'image', attributes: { 'class': 'image-sepia' } },
	{ name: 'Darken Image', type: 'widget', widget: 'image', attributes: { 'class': 'image-darken' } },
	{ name: 'Lighten Image', type: 'widget', widget: 'image', attributes: { 'class': 'image-lighten' } },
	{ name: 'Enhance Colour', type: 'widget', widget: 'image', attributes: { 'class': 'image-saturate' } },


] );


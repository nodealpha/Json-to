"use strict";

/*
 * JsonTo - Convert json to other forms
 * Build on pure JavaScript
*/

var Utils = function() {
	var self = this;
};

// check obj is Array 
Utils.prototype.isArray = function(obj) {
	return (!!obj) && (obj.constructor === Array);
};

// check obj is Object 
Utils.prototype.isObject = function(obj) {
	return (!!obj) && (obj.constructor === Object);
};

// check obj is Number
Utils.prototype.isNumeric = function(obj) {
	return typeof obj === 'number';
};

// check obj is Boolean
Utils.prototype.isBoolean = function(obj) {
	return typeof obj === 'boolean';
};

// check obj is String
Utils.prototype.isString = function(obj) {
	return typeof obj === 'string';
};

// Convert to HTML
var Html = function() {
	var self = this;

	self.rootNode = null;
	self.utils = new Utils();
};

Html.prototype.convert = function(json) {
	if (!json || json.length <= 0) {
		throw "Invalid Json";
	}

	// set root node
	this.setRootNode();
	this.parseObject(this.rootNode, json);
	return this.rootNode;
};

// Create new DOM element
Html.prototype.createDOMEle = function(eleName) {
	return document.createElement(eleName.toUpperCase());
};

// Add Classname to element
Html.prototype.addClass = function(element, classname) {
	element.classList.add(classname);
	return element;
}

// Remove Classname to element
Html.prototype.removeClass = function(element, classname) {
	element.classList.remove(classname);
	return element;
}

// Has Classname to element
Html.prototype.hasClass = function(element, classname) {
	return element.classList.contains(classname);;
}

Html.prototype.onClick = function(element, callback) {
  element.addEventListener('click', callback, false);
  return element;
}

// Set root node
Html.prototype.setRootNode = function() {
	this.rootNode = this.createDOMEle('UL');
	this.rootNode = this.addClass(this.rootNode, 'json-html');
};

// Set child
Html.prototype.setChild = function(parent, child) {
	parent.appendChild(child);
	return parent;
};

// Set child of Root Node
Html.prototype.setChildToRootNode = function(child) {
	this.roo.appendChild(child);
};

// Parse json object
Html.prototype.parseObject = function(parent, json) {
	for(var key in json) {
		if (this.utils.isObject(json[key]) || this.utils.isArray(json[key])) {
			this.createObject(parent, key, json[key]);
			continue;
		}
		this.parseNonObject(parent, key, json[key]);
	}
}

// Create object 
Html.prototype.createObject = function(parent, name, obj) {
	var listBlock = this.createDOMEle('li');
	listBlock = this.addClass(listBlock, 'li-i-blk');

	var listItemName = this.createDOMEle('span');
	listItemName.innerHTML = name;
	
	var listItemSplit = this.createDOMEle('span');
	listItemSplit.innerHTML = ' : ';

	var listItemValue = this.createDOMEle('span');

	if (this.utils.isArray(obj)) {
		listItemValue.innerHTML = '[';
		listBlock = this.addClass(listBlock, 'arr');
	}

	if (this.utils.isObject(obj)) {
		listItemValue.innerHTML = '{';		
	}

	var listBlockInner = this.createDOMEle('ul');
	listBlockInner = this.addClass(listBlockInner, 'in-blk');

	parent = this.setChild(parent, listBlock);
	listBlock = this.setChild(listBlock, listItemName);
	listBlock = this.setChild(listBlock, listItemSplit);
	listBlock = this.setChild(listBlock, listItemValue);
	listBlock = this.setChild(listBlock, listBlockInner);
	this.parseObject(listBlockInner, obj);
};

// Parse json non object
Html.prototype.parseNonObject = function(parent, name, value) {
	var listItem = this.createDOMEle('li');
	listItem = this.addClass(listItem, 'li-i');
	
	var listItemName = this.createDOMEle('span');
	listItemName.innerHTML = name;
	listItemName = this.addClass(listItemName, 'li-i-n');

	var listItemSplit = this.createDOMEle('span');
	listItemSplit.innerHTML = ' : ';
	
	var listItemValue = this.createDOMEle('span');
	listItemValue.innerHTML = value;

	if (this.utils.isString(value)) {
		listItemValue = this.addClass(listItemValue, 'li-i-str');	
	}

	if (this.utils.isNumeric(value)) {
		listItemValue = this.addClass(listItemValue, 'li-i-val');	
	}

	if (this.utils.isBoolean(value)) {
		listItemValue = this.addClass(listItemValue, 'li-i-bool');	
	}
	

	listItem = this.setChild(listItem, listItemName);
	listItem = this.setChild(listItem, listItemSplit);
	listItem = this.setChild(listItem, listItemValue);
	parent = this.setChild(parent, listItem);
};

var JsonTo = function(obj) {
	var self = this;
	self.json = obj.json;
	self.target = obj.target;
	self.html = null;
};

JsonTo.prototype.toHtml = function() {
	this.html = (new Html()).convert(this.json);
	this.target.appendChild(this.html);
	return;
};

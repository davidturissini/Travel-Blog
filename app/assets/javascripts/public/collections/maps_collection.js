var MapsCollection = Backbone.Collection.extend({
	model:Map
})

MapsCollection.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new MapsCollection(json)
}
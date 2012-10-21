var LocationsCollection = Backbone.Collection.extend({
	model:Location
})

LocationsCollection.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new LocationsCollection(json)
}
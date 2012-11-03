var TripsCollection = Backbone.Collection.extend({
	
})

TripsCollection.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new TripsCollection(json);
}

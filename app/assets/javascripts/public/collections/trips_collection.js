var TripsCollection = Backbone.Collection.extend({
	model:Trip
})

TripsCollection.createFromDataAttribute = function (node, attributeName) {
    attributeName = attributeName || "data-json";
    var json = JSON.parse( node.getAttribute(attributeName) );

    return new TripsCollection(json);
}

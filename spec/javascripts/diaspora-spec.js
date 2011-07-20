/*   Copyright (c) 2010, Diaspora Inc.  This file is
 *   licensed under the Affero General Public License version 3 or later.  See
 *   the COPYRIGHT file.
 */


Diaspora.Pages.TestPage = function() { };
Diaspora.Page = "TestPage"; 

describe("Diaspora", function() {
  describe("EventBroker", function() {
    describe("extend", function() {
      var klass;
      beforeEach(function() {
        klass = new function() {
        };
      });

      it("should add a subscribe method to the class", function() {
        Diaspora.EventBroker.extend(klass);

        expect(typeof klass.subscribe).toEqual("function");
      });

      it("should add a publish method to the class", function() {
        Diaspora.EventBroker.extend(klass);

        expect(typeof klass.publish).toEqual("function");
      });

      it("should add an events container to the class", function() {
        Diaspora.EventBroker.extend(klass);

        expect(typeof klass.eventsContainer).toEqual("object");
      });

      it("knows what to extend", function() {
        var Klass = function() {
        };

        Diaspora.EventBroker.extend(Klass);

        expect(typeof Klass.prototype.publish).toEqual("function");
        expect(typeof Klass.prototype.subscribe).toEqual("function");
        expect(typeof Klass.prototype.eventsContainer).toEqual("object");
      });

      it("adds basic pub/sub functionality to an object", function() {
        Diaspora.EventBroker.extend(klass);
        var called = false;

        klass.subscribe("events/event", function() {
          called = true;
        });

        klass.publish("events/event");

        expect(called).toBeTruthy();
      });

      describe("subscribe", function() {
        it("will subscribe to multiple events", function() {
          var firstEventCalled = false,
                  secondEventCalled = false
          events = Diaspora.EventBroker.extend({});

          events.subscribe("first/event second/event", function() {
            if (firstEventCalled) {
              secondEventCalled = true;
            } else {
              firstEventCalled = true;
            }
          });

          events.publish("first/event second/event");

          expect(firstEventCalled).toBeTruthy();
          expect(secondEventCalled).toBeTruthy();
        });
      });

      describe("publish", function() {
        it("will publish multiple events", function() {
          var firstEventCalled = false,
                  secondEventCalled = false
          events = Diaspora.EventBroker.extend({});

          events.subscribe("first/event second/event", function() {
            if (firstEventCalled) {
              secondEventCalled = true;
            } else {
              firstEventCalled = true;
            }
          });

          events.publish("first/event second/event");

          expect(firstEventCalled).toBeTruthy();
          expect(secondEventCalled).toBeTruthy();
        });
      });
    });
  });

  var MyWidget = function() {
    var self = this;
    this.ready = false;

    this.subscribe("widget/ready", function(evt, element) {
      self.ready = true;
      self.element = element;
    });
  },
  oldWidgets = Diaspora.Widgets;

  beforeEach(function() {
    Diaspora.Widgets = oldWidgets;
    Diaspora.Widgets.add("MyWidget", MyWidget);
  });

  describe("Widgets", function() {
    describe("add", function() {
      it("adds a widget to the collection", function() {
        expect(Diaspora.Widgets.MyWidget).not.toBeDefined();

        Diaspora.Widgets.add("MyWidget", MyWidget);

        expect(Diaspora.Widgets.MyWidget).toBeDefined();
        expect(Diaspora.Widgets.collection.MyWidget).toBeDefined();
      });
    });
  });

  describe("BaseWidget", function() {
    describe("instantiate", function() {
      it("instantiates a widget and calls widget/ready with an element", function() {
        var element = $("foo bar baz"),
          myWidget = Diaspora.BaseWidget.instantiate("MyWidget", element);

        expect(myWidget.ready).toBeTruthy();
        expect(myWidget.element.selector).toEqual(element.selector);
      });
    });

    describe("globalSubscribe", function() {
      it("calls subscribe on Diaspora.Page", function() {
        var spy = spyOn(Diaspora.Page, "subscribe");

        var myWidget = Diaspora.BaseWidget.instantiate("MyWidget", null);
        myWidget.globalSubscribe();

        expect(spy).toHaveBeenCalled();
      });
    });

    describe("globalPublish", function() {
      it("calls publish on Diaspora.Page", function() {
        var spy = spyOn(Diaspora.Page, "publish");

        var myWidget = Diaspora.BaseWidget.instantiate("MyWidget", null);
        myWidget.globalPublish();

        expect(spy).toHaveBeenCalled();
      });
    });
  });
});

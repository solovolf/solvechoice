/**
 * Created by coney on 16/5/6.
 */
;
(function() {
	var eventCache = {
			cacheId: 0
		}
		/*
		 自定义事件
		 */
	HTMLElement.prototype.addEvent = function(eventType, callBack) {
		if (!this.events) {
			this.events = {};
			this.events[eventType + '_id'] = eventCache.cacheId++;
			eventCache['e_' + eventCache.cacheId] = [];
			bindTap(this);
		}
		eventCache['e_' + this.events[eventType + '_id']] = [];
		eventCache['e_' + this.events[eventType + '_id']].push(callBack);
	};
	HTMLElement.prototype.removeEvent = function(eventType) {
		if (this.events) {
			this.removeEventListener('touchstart', this.touchstart);
			this.removeEventListener('touchend', this.touchend);
			this.events = null;
		}
	};

	function bindTap(ele) {
		var flag = true;
		var timeoutHandler = null;
		ele.touchstart = function(eve) {
			clearTimeout(timeoutHandler);
			flag = true;
			timeoutHandler = setTimeout(function() {
				flag = false;
			}, 750)
		}
		ele.touchend = function(eve) {
			if (!flag) {
				return;
			}
			clearTimeout(timeoutHandler);
			var events = eventCache['e_' + ele.events['tap' + '_id']];
			for (var i = 0; i < events.length; i++) {
				events[i](eve);
			}
		}

		ele.addEventListener('touchstart', ele.touchstart);
		ele.addEventListener('touchend', ele.touchend);
	}
}())
import Ember from 'ember';
import moment from 'moment';

const { computed, get, getProperties, set, Logger:logger } = Ember;

export default Ember.Service.extend(Ember.Evented, {
  _timeZone: null,

  locale: null,
  defaultFormat: null,

  timeZone: computed('_timeZone', {
    get() {
      return get(this, '_timeZone');
    },

    set(propertyKey, timeZone) {
      if (!moment.tz) {
        logger.warn('[ember-moment] attempted to set timezone, but moment-timezone is not setup.');
        return;
      }

      set(this, '_timeZone', timeZone);

      return timeZone;
    }
  }),

  setLocale(locale) {
    this.changeLocale(locale);
  },

  changeLocale(locale) {
    set(this, 'locale', locale);
    moment.locale(locale);
    this.trigger('localeChanged', locale);
  },

  setTimeZone(timeZone) {
    this.changeTimeZone(timeZone);
  },

  changeTimeZone(timeZone) {
    set(this, 'timeZone', timeZone);
    this.trigger('timeZoneChanged', timeZone);
  },

  isMoment(obj) {
    return moment.isMoment(obj);
  },

  moment() {
    const locale = this.get('locale');
    const timeZone = this.get('timeZone');

    let _timeZoneSetNAvailable = timeZone && moment.tz ? true : false;

    let time;
    if (_timeZoneSetNAvailable) {
      if (arguments.length) {
        let _args = [...arguments];
        _args.push(timeZone);
        time = moment.tz.apply(null, _args);
      } else {
        time = moment(...arguments);
        time = time.tz(timeZone);
      }
    } else {
      time = moment(...arguments);
    }

    if (locale) {
      time = time.locale(locale);
    }

    return time;
  },

  getInstance() {
    const locale = this.get('locale');
    if (locale) {
      moment.locale(locale);
    }
    return moment;
  }
});

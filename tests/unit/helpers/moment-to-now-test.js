import Ember from 'ember';
import hbs from 'htmlbars-inline-precompile';
import { moduleForComponent, test } from 'ember-qunit';

moduleForComponent('moment-to-now',{
  integration: true,
  beforeEach() {
    this.container.lookup('service:moment').changeLocale('en');
  }
});

test('one arg (date)', function(assert) {
  assert.expect(1);
  const addThreeDays = new Date();
  addThreeDays.setDate(addThreeDays.getDate() - 3);

  this.set('date', addThreeDays);

  this.render(hbs`{{moment-to-now date}}`);
  assert.equal(this.$().text(), 'in 3 days');
});

test('two args (date, inputFormat)', function(assert) {
  assert.expect(1);
  const addThreeDays = new Date();
  addThreeDays.setDate(addThreeDays.getDate() - 3);

  this.setProperties({
    format: 'LLLL',
    date: addThreeDays
  });

  this.render(hbs`{{moment-to-now date format}}`);
  assert.equal(this.$().text(), 'in 3 days');
});

test('change date input and change is reflected by bound helper', function(assert) {
  assert.expect(2);

  const momentService = this.container.lookup('service:moment');
  const context = Ember.Object.create({
    date: momentService.moment().subtract(1, 'hour'),
  });

  this.set('context', context);
  this.render(hbs`{{moment-to-now context.date}}`);
  assert.equal(this.$().text(), 'in an hour');

  Ember.run(function () {
    context.set('date', momentService.moment().subtract(2, 'hour'));
  });

  assert.equal(this.$().text(), 'in 2 hours');
});

test('can inline a locale instead of using global locale', function(assert) {
  assert.expect(1);

  const momentService = this.container.lookup('service:moment');
  this.set('date', momentService.moment().subtract(1, 'hour'));
  this.render(hbs`{{moment-to-now date locale='es'}}`);
  assert.equal(this.$().text(), 'en una hora');
});

test('can be called with null', function(assert) {
  assert.expect(1);

  this.set('date', null);
  this.render(hbs`{{moment-to-now date allow-empty=true}}`);
  assert.equal(this.$().text(), '');
});

test('can be called with null using global config option', function(assert) {
  assert.expect(1);

  this.set('date', null);
  this.render(hbs`{{moment-to-now date}}`);
  assert.equal(this.$().text(), '');
});

test('unable to called with null overriding global config option', function(assert) {
  assert.expect(1);

  this.set('date', null);
  this.render(hbs`{{moment-to-now date allow-empty=false}}`);
  assert.equal(this.$().text(), 'Invalid date');
});

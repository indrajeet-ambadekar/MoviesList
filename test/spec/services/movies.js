'use strict';

describe('Service: Movies', function () {

  // load the service's module
  beforeEach(module('moviesApp'));

  // instantiate service
  var Movies;
  beforeEach(inject(function (_Movies_) {
    Movies = _Movies_;
  }));

  it('should do something', function () {
    expect(!!Movies).toBe(true);
  });

});

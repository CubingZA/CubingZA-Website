import {jest} from '@jest/globals';
import * as controller from "./ranking.controller.js"

jest.mock('express');
const express = (await import('express')).default;
const routerMock = express.Router;
express.Router.mockReturnValue(routerMock);

jest.unstable_mockModule('../../auth/auth.service.js', ()=>({
  isAuthenticated: jest.fn(()=>'authService.isAuthenticated'),
  hasRole: jest.fn((role)=>`authService.hasRole.${role}`)
}));
const authService = (await import('../../auth/auth.service.js'));


describe('Ranking API Router:', function() {

  let rankingRouter;
  beforeEach(async function() {
    rankingRouter = (await import('./index.js')).default;
  });

  it('should return an express router instance', function() {
    expect(rankingRouter).toEqual(routerMock);
  });

  describe('GET /api/rankings/:province/:event/single', function() {
    it('should route to ranking.controller.getSingleRankings', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/:province/:event/single', controller.getSingleRankings);
    });
  });

  describe('GET /api/rankings/:province/:event/average', function() {
    it('should route to ranking.controller.getAverageRankings', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/:province/:event/average', controller.getAverageRankings);
    });
  });

  describe('GET /api/rankings/:province/:event/single/count', function() {
    it('should route to ranking.controller.getSingleCount', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/:province/:event/single/count', controller.getSingleCount);
    });
  });

  describe('GET /api/rankings/:province/:event/average/count', function() {
    it('should route to ranking.controller.getAverageCount', function() {
      expect(routerMock.get)
        .toHaveBeenCalledWith('/:province/:event/average/count', controller.getAverageCount);
    });
  });
});

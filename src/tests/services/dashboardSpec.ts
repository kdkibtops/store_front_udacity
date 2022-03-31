import { DashBoardStats } from '../../services/dashboard';

const testDashboard = new DashBoardStats();

describe('Dashboard testing', () => {
  it('Should have completed orders by user method', () => {
    expect(testDashboard.completedOrdersByUser).toBeDefined();
  });
  it('Should have least popular products method', () => {
    expect(testDashboard.leastPopularProducts).toBeDefined();
  });
  it('Should have products by categories method', () => {
    expect(testDashboard.productsByCategories).toBeDefined();
  });
  it('Should have top popular products method', () => {
    expect(testDashboard.topPopularProducts).toBeDefined();
  });
  it('Should have top sales products method', () => {
    expect(testDashboard.topProductsSales).toBeDefined();
  });
});

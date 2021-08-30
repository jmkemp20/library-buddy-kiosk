import { Outlet } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core';
import DashboardNavbar from './DashboardNavbar';

const DashboardLayoutRoot = experimentalStyled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  })
);

const DashboardLayoutWrapper = experimentalStyled('div')({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64
});

const DashboardLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const DashboardLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const DashboardLayout = () => (
    <DashboardLayoutRoot>
      <DashboardNavbar />
      <DashboardLayoutWrapper>
        <DashboardLayoutContainer>
          <DashboardLayoutContent>
            <Outlet />
          </DashboardLayoutContent>
        </DashboardLayoutContainer>
      </DashboardLayoutWrapper>
    </DashboardLayoutRoot>
);


export default DashboardLayout;

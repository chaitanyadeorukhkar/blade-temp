import DollarsIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<DollarsIcon />', () => {
  it('should render DollarsIcon', () => {
    const { container } = renderWithTheme(
      <DollarsIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});

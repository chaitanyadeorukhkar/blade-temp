import MoreHorizontalIcon from './';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.web';

describe('<MoreHorizontalIcon />', () => {
  it('should render MoreHorizontalIcon', () => {
    const { container } = renderWithTheme(
      <MoreHorizontalIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    );
    expect(container).toMatchSnapshot();
  });
});

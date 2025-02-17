import CheckIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<CheckIcon />', () => {
  it('should render CheckIcon', () => {
    const renderTree = renderWithTheme(
      <CheckIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});

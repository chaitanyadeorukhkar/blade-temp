import ChevronDownIcon from '.';
import renderWithTheme from '~src/_helpers/testing/renderWithTheme.native';

describe('<ChevronDownIcon />', () => {
  it('should render ChevronDownIcon', () => {
    const renderTree = renderWithTheme(
      <ChevronDownIcon color="feedback.icon.neutral.lowContrast" size="large" />,
    ).toJSON();
    expect(renderTree).toMatchSnapshot();
  });
});

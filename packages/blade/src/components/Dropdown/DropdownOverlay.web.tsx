import React from 'react';
import throttle from 'lodash/throttle';
import styled, { keyframes, css } from 'styled-components';
import type { FlattenSimpleInterpolation } from 'styled-components';
import { componentIds } from './dropdownUtils';
import { useDropdown } from './useDropdown';
import BaseBox from '~components/Box/BaseBox';
import { castWebType, makeMotionTime, makeSize, metaAttribute, MetaConstants } from '~utils';
import { useTheme } from '~components/BladeProvider';
// Reading directly because its not possible to get theme object on top level to be used in keyframes
import spacing from '~tokens/global/spacing';
import type { SpacingValueType } from '~components/Box/BaseBox';
import size from '~tokens/global/size';
import type { TestID } from '~src/_helpers/types';
import { assignWithoutSideEffects } from '~src/utils/assignWithoutSideEffects';

const dropdownFadeIn = keyframes`
from {
  transform: translateY(${makeSize(spacing[0])});
  opacity: 0;
}

to {
  transform: translateY(${makeSize(spacing[3])});
  opacity: 1;
}
`;

const dropdownFadeOut = keyframes`
from {
  transform: translateY(${makeSize(spacing[3])});
  opacity: 1;
}

to {
  transform: translateY(${makeSize(spacing[0])});
  opacity: 0;
}
`;

const StyledDropdownOverlay = styled(BaseBox)<{
  transition: FlattenSimpleInterpolation;
  onAnimationEnd: () => void;
}>(
  (props) =>
    css`
      ${props.transition}
      transform: translateY(${makeSize(props.theme.spacing[3])});
      opacity: 0;
      z-index: 99;
    `,
);

type DropdownOverlayProps = {
  children: React.ReactNode;
} & TestID;

/**
 * Overlay of dropdown
 *
 * Wrap your ActionList within this component
 */
const _DropdownOverlay = ({ children, testID }: DropdownOverlayProps): JSX.Element => {
  const { isOpen, triggererRef, hasLabelOnLeft } = useDropdown();
  const { theme } = useTheme();
  const [display, setDisplay] = React.useState<'none' | 'block'>('none');
  const [width, setWidth] = React.useState<SpacingValueType>('100%');

  const fadeIn = css`
    animation: ${dropdownFadeIn} ${makeMotionTime(theme.motion.duration.quick)}
      ${String(theme.motion.easing.entrance.revealing)};
  `;

  const fadeOut = css`
    animation: ${dropdownFadeOut} ${makeMotionTime(theme.motion.duration.quick)}
      ${String(theme.motion.easing.entrance.revealing)};
  `;

  React.useEffect(() => {
    if (isOpen) {
      // On Safari clicking on a non input element doesn't focuses it https://bugs.webkit.org/show_bug.cgi?id=22261
      triggererRef.current?.focus();
      setDisplay('block');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  // We want to set width of overlay as per width of the SelectInput
  React.useEffect(() => {
    const setOverlayWidth = throttle((): void => {
      if (triggererRef.current?.clientWidth && hasLabelOnLeft) {
        const svgWidth: number = size[16];
        const interactionElementPadding: number = theme.spacing[4];
        const offset = svgWidth + interactionElementPadding;
        // SelectInput is -> Button + InteractionElement on right (the chevron icon)
        // So we add the interactionElement offset with Button's width.
        setWidth(makeSize(triggererRef.current?.clientWidth + offset));
      } else {
        // We don't have to worry about setting the custom width when label is on top since we can just 100% width of parent div
        setWidth('100%');
        window.removeEventListener('resize', setOverlayWidth);
      }
    }, 1000);

    setOverlayWidth();
    window.addEventListener('resize', setOverlayWidth);
    return () => {
      window.removeEventListener('resize', setOverlayWidth);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setWidth, triggererRef, hasLabelOnLeft]);

  const onAnimationEnd = React.useCallback(() => {
    if (isOpen) {
      setDisplay('block');
    } else {
      setDisplay('none');
    }
  }, [isOpen]);
  const styles = React.useMemo(() => ({ opacity: isOpen ? 1 : 0 }), [isOpen]);

  return (
    <BaseBox position="relative">
      <StyledDropdownOverlay
        width={width}
        style={styles}
        display={castWebType(display)}
        right="0px"
        position="absolute"
        transition={isOpen ? fadeIn : fadeOut}
        onAnimationEnd={onAnimationEnd}
        {...metaAttribute({ name: MetaConstants.DropdownOverlay, testID })}
      >
        {children}
      </StyledDropdownOverlay>
    </BaseBox>
  );
};

const DropdownOverlay = assignWithoutSideEffects(_DropdownOverlay, {
  componentId: componentIds.DropdownOverlay,
});

export { DropdownOverlay, DropdownOverlayProps };

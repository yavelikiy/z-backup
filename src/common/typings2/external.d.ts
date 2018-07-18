declare module 'wix-style-react*';

declare module 'wix-style-react/Text' {
  export type Appearance =
    'H0' | 'H1' | 'H2' | 'H2.1' | 'H3' | 'H4' |
    'T1' | 'T1.1' | 'T1.2' | 'T1.3' | 'T1.4' |
    'T2' | 'T2.1' | 'T2.2' | 'T2.3' |
    'T3' | 'T3.1' | 'T3.2' | 'T3.3' | 'T3.4' |
    'T4' | 'T4.1' | 'T4.2' | 'T4.3' |
    'T5' | 'T5.1';

  export interface TextProps {
    appearance?: Appearance;
    ellipsis?: boolean;
    forceHideTitle?: boolean;
  }

  export default class Text extends React.Component<TextProps, {}> {}
}

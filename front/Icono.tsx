import { Text, type StyleProp, type TextStyle } from 'react-native'

type Props = {
  name: string
  size?: number
  color?: string
  style?: StyleProp<TextStyle>
}

/* Icono de Material Icons (Google Fonts), cargado en App.tsx con expo-font. */
export default function Icono({ name, size = 24, color = '#000', style }: Props) {
  return (
    <Text
      accessibilityElementsHidden
      importantForAccessibility="no"
      style={[
        {
          fontFamily: 'MaterialIcons',
          fontSize: size,
          lineHeight: size,
          color,
        },
        style,
      ]}
    >
      {name}
    </Text>
  )
}

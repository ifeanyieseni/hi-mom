import * as React from 'react'
import { Circle, Path, Svg } from 'react-native-svg'

export function WelcomeIllustration({ width = 300, height = 250 }) {
  return (
    <Svg width={width} height={height} viewBox='0 0 300 250' fill='none'>
      {/* Pregnant woman silhouette */}
      <Path
        d='M150 50C150 50 130 70 130 100V130C130 150 150 170 150 190C170 190 180 180 180 170C180 160 170 150 165 150C160 150 155 155 155 160C155 165 158 168 162 168C166 168 168 165 168 160C168 150 160 140 150 140C140 140 132 148 132 158C132 168 140 178 150 178'
        stroke='#052871'
        strokeWidth='4'
        strokeLinecap='round'
        strokeLinejoin='round'
      />

      {/* Heart shape */}
      <Path
        d='M220 100C220 100 240 80 250 90C260 100 250 120 230 135C210 150 200 160 180 175C160 160 150 150 130 135C110 120 100 100 110 90C120 80 140 100 140 100'
        fill='#FECACA'
        stroke='#052871'
        strokeWidth='2'
      />

      {/* Medical cross */}
      <Path d='M80 80H70V90H80V100H90V90H100V80H90V70H80V80Z' fill='#052871' />

      {/* Baby face */}
      <Circle
        cx='200'
        cy='110'
        r='15'
        fill='#FEE2E2'
        stroke='#052871'
        strokeWidth='2'
      />
      <Circle cx='195' cy='107' r='2' fill='#000' />
      <Circle cx='205' cy='107' r='2' fill='#000' />
      <Path
        d='M195 117C195 117 198 120 200 120C202 120 205 117 205 117'
        stroke='#000'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </Svg>
  )
}

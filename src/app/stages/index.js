import orderBy from 'lodash/orderBy'

import html from './html'
import js from './js'
import python from './python'
import ruby from './ruby'
import net from './net'
import cpp from './cpp'
import haskell from './haskell'
import java from './java'
import fortran from './fortran'
const stages = [html, js, python, ruby, net, cpp, haskell, java, fortran]
export default orderBy(stages, 'id', 'asc')

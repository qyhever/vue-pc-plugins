import Vue from 'vue'
import {
  Message,
  DatePicker,
  Tag,
  Popover,
  Select,
  Option,
  Table,
  TableColumn,
  Button,
  Image,
  Row,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Input,
  Menu,
  Submenu,
  MenuItem,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Form,
  FormItem,
  Dialog
  // Scrollbar
} from 'element-ui'

import Scrollbar from '@/components/scrollbar'

Vue
  .use(DatePicker)
  .use(Tag)
  .use(Popover)
  .use(Select)
  .use(Option)
  .use(Table)
  .use(TableColumn)
  .use(Button)
  .use(Image)
  .use(Row)
  .use(Checkbox)
  .use(CheckboxButton)
  .use(CheckboxGroup)
  .use(Input)
  .use(Menu)
  .use(Submenu)
  .use(MenuItem)
  .use(Scrollbar)
  .use(Dropdown)
  .use(DropdownMenu)
  .use(DropdownItem)
  .use(Form)
  .use(FormItem)
  .use(Dialog)

Vue.prototype.$message = Message

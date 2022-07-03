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
  Input
} from 'element-ui'

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

Vue.prototype.$message = Message

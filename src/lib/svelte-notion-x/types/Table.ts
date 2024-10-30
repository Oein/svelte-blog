interface Parent {
  type: string;
  page_id: string;
}
interface Createdby {
  object: string;
  id: string;
}
interface Table {
  table_width: number;
  has_column_header: boolean;
  has_row_header: boolean;
}
interface Parent2 {
  type: string;
  block_id: string;
}
interface Text {
  content: string;
  link?: any;
}
interface Annotations {
  bold: boolean;
  italic: boolean;
  strikethrough: boolean;
  underline: boolean;
  code: boolean;
  color: string;
}
interface Cell {
  type: string;
  text: Text;
  annotations: Annotations;
  plain_text: string;
  href?: any;
}
interface Tablerow {
  cells: Cell[][];
}
interface Child {
  object: string;
  id: string;
  parent: Parent2;
  created_time: string;
  last_edited_time: string;
  created_by: Createdby;
  last_edited_by: Createdby;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
  type: string;
  table_row: Tablerow;
}
interface NotionTable {
  object: string;
  id: string;
  parent: Parent;
  created_time: string;
  last_edited_time: string;
  created_by: Createdby;
  last_edited_by: Createdby;
  has_children: boolean;
  archived: boolean;
  in_trash: boolean;
  type: string;
  table: Table;
  children: Child[];
}

export type { NotionTable };

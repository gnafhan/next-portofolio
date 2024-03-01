import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue} from "@nextui-org/react";
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import {EyeIcon} from "./EyeIcon";
import { columns, users } from "@/data/data";
import { useQueryClient } from 'react-query';
import useDataFetching from "@/util/getLink";
import { useRouter } from "next/router";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function TableData({token}) {
  const {data, isLoading, error} = useDataFetching("https://nest-lnk-2432ca7b74f8.herokuapp.com/links", token)
  const router = useRouter()

  const handleDelete = async (id)=>{
    try {
      const response = await fetch('https://nest-lnk-2432ca7b74f8.herokuapp.com/links/'+id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Ganti 'YOUR_BEARER_TOKEN' dengan token Bearer Anda jika diperlukan
          'Authorization': `Bearer ${token}`
        }
      });
      

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      router.reload()
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  }

  const renderCell = React.useCallback((user, columnKey) => {
    const cellValue = user[columnKey];

    switch (columnKey) {
      case "name":
        return (
          <div>
            {user.path}
          </div>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm">{user.originalURL}</p>
            {/* <p className="text-bold text-sm capitalize text-default-400"></p> */}
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[user.status]} size="sm" variant="flat">
            {cellValue}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Go to link">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={()=> router.push(user.originalURL)} >
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit link">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50" onClick={()=> router.push("/links/edit/" + user.id)} >
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete link">
              <span className="text-lg text-danger cursor-pointer active:opacity-50" onClick={()=> handleDelete(user.id)}>
                <DeleteIcon />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  if (isLoading){ return <p>Loading...</p>} else{
    return (
      <Table aria-label="Example table with custom cells">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={data?data:users}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      );
  }
  
}

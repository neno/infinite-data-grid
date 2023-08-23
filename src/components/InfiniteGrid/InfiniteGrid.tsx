import { useEffect, useRef, useState } from 'react';
import { fetchPosts } from '../../api/posts';
import { AgGridReact } from 'ag-grid-react';
import { MyTable } from '../MyTable/MyTable';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const limit = 20;

const columnDefs = [
  {
    headerName: 'ID',
    field: 'id',
    sortable: true,
    filter: true,
  },
  { headerName: 'User Id', field: 'userId', sortable: true, filter: true },
  { headerName: 'Title', field: 'title', sortable: true, filter: true },
  { headerName: 'Body', field: 'body', sortable: true, filter: true },
];

const gridOptions = {
  rowModelType: 'clientSide',
  columnDefs: columnDefs,
};

export const InfiniteGrid = () => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const myOuterRef = useRef<HTMLDivElement>(null);
  const myGridRef = useRef<HTMLDivElement>(null);
  const myObserver = useRef<IntersectionObserver | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(0);

  useEffect(() => {
    if (rowData.length === 0) return;

    const intersectionOptions = {
      root: myOuterRef.current,
      rootMargin: '0px 0px 0px 0px',
      threshold: 0,
    };

    console.log('myGridRef.current', myGridRef.current);
    if (myObserver.current) {
      myObserver.current.disconnect();
    }

    myObserver.current = new IntersectionObserver((entries) => {
      const entry = entries[0];
      console.log('entry', entry);

      if (entry.isIntersecting) {
        console.log('entry.isIntersecting', entry.isIntersecting);
        // setPage((prev) => prev + 1);
      }
    }, intersectionOptions);

    myObserver.current.observe(myGridRef.current!);
  }, [myGridRef.current, rowData]);

  useEffect(() => {
    if (page) {
      const loadNewPosts = async () => {
        const newPosts = await fetchPosts(page, limit);
        setRowData((prev) => [...prev, ...newPosts]);
      };
      loadNewPosts();
    }
  }, [page]);

  useEffect(() => setPage(1), []);

  const getRowId = (row: any) => {
    console.log('getRowId', row.data.id);
    return row.data.id;
  };

  const onGridReady = (params: any) => {
    const lastRowIdx = params.api.getLastDisplayedRow();
    const lastRow = params.api.getDisplayedRowAtIndex(lastRowIdx);
    console.log('onGridReady - lastRow', lastRow);
    params.api.sizeColumnsToFit();
  };

  if (rowData.length === 0) {
    return <p>"Loading..."</p>;
  }

  return (
    <div
      style={{
        width: 800,
        height: 400,
        color: 'black',
        backgroundColor: 'yellow',
        border: '1em solid yellow',
        overflow: 'hidden',
      }}
      ref={myOuterRef}
    >
      <div
        ref={myGridRef}
        style={{
          height: '100%',
          width: '100%',
          backgroundColor: 'orange',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        <AgGridReact
          gridOptions={{
            rowModelType: 'clientSide',
            columnDefs: columnDefs,
          }}
          rowData={rowData}
          getRowId={getRowId}
          rowModelType='clientSide'
          domLayout={'autoHeight'}
          // ref={gridRef}
          // key={getRowId}
          // onRowDataUpdated={gridDataUpdated}
          onGridReady={onGridReady}
        />
        {/* <MyTable data={rowData} /> */}
        {/* <div
          ref={bottomRef}
          style={{ height: 5, backgroundColor: 'red' }}
        ></div> */}
      </div>
    </div>
  );
};

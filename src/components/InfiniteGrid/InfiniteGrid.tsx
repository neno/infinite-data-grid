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
  const myGridRef = useRef<AgGridReact>(null);
  const myObserver = useRef<IntersectionObserver | null>(null);
  const [rowData, setRowData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);

  // useEffect(() => {
  //   if (rowData.length === 0) return;
  //
  //   const intersectionOptions = {
  //     root: myOuterRef.current,
  //     rootMargin: '0px 0px 0px 0px',
  //     threshold: 0,
  //   };
  //
  //   console.log('myGridRef.current', myGridRef.current);
  //   if (myObserver.current) {
  //     myObserver.current.disconnect();
  //   }
  //
  //   myObserver.current = new IntersectionObserver((entries) => {
  //     const entry = entries[0];
  //     console.log('entry', entry);
  //
  //     if (entry.isIntersecting) {
  //       console.log('entry.isIntersecting', entry.isIntersecting);
  //       // setPage((prev) => prev + 1);
  //     }
  //   }, intersectionOptions);
  //
  //   myObserver.current.observe(myGridRef.current!);
  // }, [myGridRef.current, rowData]);

  useEffect(() => {
    if (page) {
      const loadNewPosts = async () => {
        const newPosts = await fetchPosts(page, limit);
        setRowData((prev) => [...prev, ...newPosts]);
      };
      loadNewPosts();
    }
  }, [page]);

  // useEffect(() => setPage(1), []);

  // const getRowId = (row: any) => {
  //   console.log('getRowId', row.data.id);
  //   return row.data.id;
  // };

  // const onGridReady = (params: any) => {
  //   const lastRowIdx = params.api.getLastDisplayedRow();
  //   const lastRow = params.api.getDisplayedRowAtIndex(lastRowIdx);
  //   console.log('onGridReady - lastRow', lastRow);
  //   params.api.sizeColumnsToFit();
  // };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  // useEffect(() => {
  //   const loadNewPosts = async () => {
  //     const newPosts = await fetchPosts(page, limit);
  //     setRowData((prev) => [...prev, ...newPosts]);
  //   };
  //   loadNewPosts();
  // }, [page]);

  const onBodyScrollEnd = (event: any) => {
    const gridApi = myGridRef.current?.api;
    if (gridApi) {
      const lastDisplayedRow = gridApi.getLastDisplayedRow();
      const totalRowCount = gridApi.getDisplayedRowCount();
      if (lastDisplayedRow === totalRowCount - 1) {
        loadMore()
      }
    }
  };

  if (rowData.length === 0) {
    return <p>"Loading..."</p>;
  }

  return (
    <div>
      <button onClick={loadMore}>Load More...</button>
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
            overflowY: 'hidden',
          }}
        >
          <AgGridReact
            ref={myGridRef}
            columnDefs={columnDefs}
            rowData={rowData}
            cacheBlockSize={limit}
            infiniteInitialRowCount={0}
            onBodyScrollEnd={onBodyScrollEnd}
            rowModelType='clientSide'
            // domLayout={'autoHeight'}
            // ref={gridRef}
            // key={getRowId}
            // onRowDataUpdated={gridDataUpdated}
            // onGridReady={onGridReady}
          />
          {/* <MyTable data={rowData} /> */}
          {/* <div
          ref={bottomRef}
          style={{ height: 5, backgroundColor: 'red' }}
        ></div> */}
        </div>
      </div>
    </div>
  );
};

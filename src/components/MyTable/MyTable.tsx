import { Post } from '../../types';

export interface MyTableProps {
  data: Post[];
}

export const MyTable = ({ data }: MyTableProps) => {
  if (data.length === 0) {
    return <div>no data</div>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>userId</th>
          <th>title</th>
          <th>body</th>
        </tr>
      </thead>
      <tbody style={{ height: '300px', backgroundColor: 'green' }}>
        {data.map((row) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.userId}</td>
            <td>{row.title}</td>
            <td>{row.body}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

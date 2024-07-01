
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export const PaginationComponent = ({actualPage, ChangePage,count}: {actualPage: number, ChangePage: (event: React.ChangeEvent<unknown>, value: number) => void, count: number}) => {

    return (
        <Stack spacing={2}>
          <Pagination count={count} page={actualPage} onChange={ChangePage} variant="outlined" shape="rounded" size='large' />
        </Stack>
    );
    }


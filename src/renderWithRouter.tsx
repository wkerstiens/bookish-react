import {ReactElement} from 'react';
import {render} from '@testing-library/react';
import {MemoryRouter as Router} from 'react-router';

const renderWithRouter = (component: ReactElement) =>{
    return {
        ...render(<Router>{component}</Router>),
    }
}

export default renderWithRouter;
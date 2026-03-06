import { Routes } from '@angular/router';
import { ConfirmPage } from './pages/confirm-page/confirm-page';
import { HomePage } from './pages/home-page/home-page';
import { NotifyPage } from './pages/notify-page/notify-page';

export const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'ngx-notify',
        component: NotifyPage
    },
    {
        path: 'ngx-confirm',
        component: ConfirmPage
    }
];

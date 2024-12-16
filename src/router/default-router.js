import React from 'react'
import Index from '../views/dashboard/index'
// import { Switch, Route } from 'react-router-dom'

//Invoice
import CreateInvoice from '../views/dashboard/invoice/create-invoice'
import UpdateInvoice from '../views/dashboard/invoice/update-invoice'

// Sales
import SalesList from '../views/dashboard/invoice/sales-list'

// lead-list
import LeadList from '../views/dashboard/lead/lead-list'
import LeadAdd from '../views/dashboard/lead/lead-add'
import LeadUpdate from '../views/dashboard/lead/lead-profile'

import AdminProfile from '../views/dashboard/admin/admin-profile'

//Order
import OrderUpdate from '../views/dashboard/diet/food-form'
import DietList from '../views/dashboard/diet/diet-list'
import FoodList from '../views/dashboard/diet/food-list'

//Booking
import RtlSupport from '../views/dashboard/special-pages/RtlSupport'

//admin
import Admin from '../views/dashboard/admin/admin'
import Default from '../layouts/dashboard/default'

//inquiry
import ExpenseList from '../views/dashboard/expense/expense-list'
import ExpenseView from '../views/dashboard/expense/add-expense'
import ExpenseUpdate from '../views/dashboard/expense/edit-expense'

// Exercise List
import ExerciseList from '../views/dashboard/exercise/exercise-list'

//Admin
import AdminList from '../views/dashboard/admin/admin-list'
import AdminAdd from '../views/dashboard/admin/admin-add'

//Client
import ClientList from '../views/dashboard/client_admin/client-list'

//User
import UserProfile from '../views/dashboard/user/user-profile'
import UserAdd from '../views/dashboard/user/user-add'
import UserList from '../views/dashboard/user/user-list'

//Employee
import EmployeeList from '../views/dashboard/employee/employee-list'
import EmployeeAdd from '../views/dashboard/employee/employee-add'
import EmployeeProfile from '../views/dashboard/employee/employee-profile'

//Offer Email
import OfferList from '../views/dashboard/offer-email/offer-list'
import OfferEmailAdd from '../views/dashboard/offer-email/offer-add'
import OfferView from '../views/dashboard/offer-email/offer-view'
import OfferEMailSend from '../views/dashboard/offer-email/offer-email-send'

//Attendance
import Scanner from '../views/dashboard/attendance/scaning'
import Attendance from '../views/dashboard/attendance/attendance'

//Edit Diet and Exercise
import EditDiet from '../views/dashboard/diet/diet-edit'
import EditeExercise from '../views/dashboard/exercise/exercise-edit'



export const DefaultRouter = [
  {
    path: '/',
    element: <Default />,
    children: [
      {
        path: 'dashboard',
        element: <Index />,
      },
      {
        path: 'dashboard/special-pages/rtl-support',
        element: <RtlSupport />,
      },
      {
        path: 'dashboard/create-invoice',
        element: <CreateInvoice />,
      },
      {
        path: 'dashboard/update-invoice',
        element: <UpdateInvoice />,
      },
      {
        path: 'dashboard/sales-list',
        element: <SalesList />,
      },
      {
        path: 'dashboard/lead-list',
        element: <LeadList />,
      },
      {
        path: 'dashboard/lead-add',
        element: <LeadAdd />,
      },
      {
        path: 'dashboard/lead-update',
        element: <LeadUpdate />,
      },
      {
        path: 'dashboard/admin-profile',
        element: <AdminProfile />,
      },
      {
        path: 'dashboard/admin',
        element: <Admin />,
      },
      {
        path: 'dashboard/food-list',
        element: <FoodList />,
      },
      {
        path: 'dashboard/diet-list',
        element: <DietList />,
      },
      {
        path: 'dashboard/exercise-list',
        element: <ExerciseList />,
      },
      {
        path: 'dashboard/expense',
        element: <ExpenseList />,
      },
      {
        path: 'dashboard/add-expense',
        element: <ExpenseView />,
      },
      {
        path: 'expense/update-expense',
        element: <ExpenseUpdate />,
      },
      {
        path: 'admin',
        element: <AdminList />,
      },
      {
        path: 'admin/add-admin',
        element: <AdminAdd />,
      },
      {
        path: 'client-admin',
        element: <ClientList />,
      },
      {
        path: 'user',
        element: <UserList />,
      },
      {
        path: 'user/add-user',
        element: <UserAdd />,
      },
      {
        path: 'user/profile-user',
        element: <UserProfile />,
      },
      {
        path: 'employee',
        element: <EmployeeList />,
      },
      {
        path: 'employee/add-employee',
        element: <EmployeeAdd />,
      },
      {
        path: 'employee/profile-employee',
        element: <EmployeeProfile />,
      },
      {
        path: 'offer-email',
        element: <OfferList />,
      },
      {
        path: 'offer-email/add-offer',
        element: <OfferEmailAdd />,
      },
      {
        path: 'offer-email/view-offer',
        element: <OfferView />,
      },
      {
        path: 'offer-email/send-offer',
        element: <OfferEMailSend />,
      },
      {
        path: 'dashboard/attendance',
        element: <Attendance />,
      },
      {
        path: 'dashboard/attendance/scan',
        element: <Scanner />,
      },
      // avadh
      {
        path: 'dashboard/edit-diet',
        element: <EditDiet />,
      },
      {
        path: 'dashboard/edit-exercise',
        element: <EditeExercise />,
      },
      // avadh
    ],
  },
]

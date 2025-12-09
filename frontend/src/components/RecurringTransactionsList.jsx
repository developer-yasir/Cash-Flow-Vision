import React from 'react';
import moment from 'moment';

const RecurringTransactionsList = ({ recurringExpenses, onDeleteRecurring }) => {
  if (!recurringExpenses || recurringExpenses.length === 0) {
    return (
      <p className="text-center text-gray-500 py-8">No recurring expenses set up yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-left">Category</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Frequency</th>
            <th className="py-3 px-6 text-left">Start Date</th>
            <th className="py-3 px-6 text-left">End Date</th>
            <th className="py-3 px-6 text-left">Next Occurrence</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {recurringExpenses.map(expense => (
            <tr key={expense._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                <div className="flex items-center">
                  <span className="font-medium">{expense.description}</span>
                </div>
              </td>
              <td className="py-3 px-6 text-left">
                <span>{expense.category}</span>
              </td>
              <td className="py-3 px-6 text-left">
                <span className="font-semibold text-red-500">-${expense.amount.toFixed(2)}</span>
              </td>
              <td className="py-3 px-6 text-left">
                <span>{expense.frequency}</span>
              </td>
              <td className="py-3 px-6 text-left">
                <span>{moment(expense.startDate).format('MMMM Do, YYYY')}</span>
              </td>
              <td className="py-3 px-6 text-left">
                <span>{expense.endDate ? moment(expense.endDate).format('MMMM Do, YYYY') : 'N/A'}</span>
              </td>
              <td className="py-3 px-6 text-left">
                <span>{moment(expense.nextOccurrence).format('MMMM Do, YYYY')}</span>
              </td>
              <td className="py-3 px-6 text-center">
                <div className="flex item-center justify-center">
                  {/* Edit button */}
                  <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                    </svg>
                  </div>
                  {/* Delete button */}
                  <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110" onClick={() => onDeleteRecurring(expense._id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecurringTransactionsList;
import React, { useState } from 'react';
import { Table, Card, Tabs, Statistic, Row, Col, DatePicker, Select, Badge, Typography } from 'antd';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { LineChart, Line } from 'recharts';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';

const { TabPane } = Tabs;
const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Sample colors for categories
const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28EFF',
    '#FF85C0', '#FF4500', '#008080', '#4B0082', '#556B2F',
    '#8B4513', '#483D8B', '#2F4F4F'
];

const BankStatementDashboard = ({ data }) => {
    const [dateRange, setDateRange] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Default to sample data if not provided
    const analysisData = data || {
        rawData: [],
        analysis: {
            totalDebit: 5230.45,
            totalCredit: 6200.00,
            netCashflow: 969.55,
            transactionCount: 24,
            startDate: '2024-03-01',
            endDate: '2024-04-01',
            averageTransaction: 217.94,
            largestExpense: {
                amount: 1200.00,
                date: '2024-03-05',
                description: 'RENT PAYMENT'
            },
            largestIncome: {
                amount: 3500.00,
                date: '2024-03-15',
                description: 'SALARY DEPOSIT'
            }
        },
        categories: [
            { category: 'Housing', totalDebit: 1200, totalCredit: 0, netAmount: -1200, transactionCount: 1, percentageOfExpenses: 22.94 },
            { category: 'Salary/Income', totalDebit: 0, totalCredit: 5700, netAmount: 5700, transactionCount: 2, percentageOfIncome: 91.94 },
            { category: 'Groceries', totalDebit: 650.45, totalCredit: 0, netAmount: -650.45, transactionCount: 5, percentageOfExpenses: 12.44 },
            { category: 'Dining', totalDebit: 320.00, totalCredit: 0, netAmount: -320.00, transactionCount: 8, percentageOfExpenses: 6.12 },
            { category: 'Utilities', totalDebit: 280.00, totalCredit: 0, netAmount: -280.00, transactionCount: 3, percentageOfExpenses: 5.35 },
            { category: 'Transport', totalDebit: 180.00, totalCredit: 0, netAmount: -180.00, transactionCount: 4, percentageOfExpenses: 3.44 },
            { category: 'Entertainment', totalDebit: 100.00, totalCredit: 0, netAmount: -100.00, transactionCount: 2, percentageOfExpenses: 1.91 },
            { category: 'Other', totalDebit: 2500.00, totalCredit: 500, netAmount: -2000.00, transactionCount: 5, percentageOfExpenses: 47.80 }
        ],
        monthlySummary: [
            { month: '2024-03', totalDebit: 5230.45, totalCredit: 6200.00, netCashflow: 969.55, transactionCount: 24 }
        ],
        categorizedTransactions: []
    };

    // Filter transactions based on selected date range and category
    const getFilteredTransactions = () => {
        let filtered = [...(analysisData.categorizedTransactions || [])];

        if (dateRange && dateRange[0] && dateRange[1]) {
            const startDate = dateRange[0].startOf('day').valueOf();
            const endDate = dateRange[1].endOf('day').valueOf();

            filtered = filtered.filter(transaction => {
                const transactionDate = new Date(transaction.date).valueOf();
                return transactionDate >= startDate && transactionDate <= endDate;
            });
        }

        if (selectedCategory !== 'All') {
            filtered = filtered.filter(transaction => transaction.category === selectedCategory);
        }

        return filtered;
    };

    // Calculate filtered summary
    const getFilteredSummary = () => {
        const filtered = getFilteredTransactions();
        const totalDebit = filtered.reduce((sum, t) => sum + (t.debit || 0), 0);
        const totalCredit = filtered.reduce((sum, t) => sum + (t.credit || 0), 0);

        return {
            totalDebit,
            totalCredit,
            netCashflow: totalCredit - totalDebit,
            transactionCount: filtered.length
        };
    };

    const filteredSummary = getFilteredSummary();

    // Transaction table columns
    const columns = [
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            sorter: (a, b) => new Date(a.date) - new Date(b.date)
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (text) => <Badge status="processing" text={text} />
        },
        {
            title: 'Debit',
            dataIndex: 'debit',
            key: 'debit',
            render: (value) => value ? `$${value.toFixed(2)}` : '-',
            sorter: (a, b) => (a.debit || 0) - (b.debit || 0)
        },
        {
            title: 'Credit',
            dataIndex: 'credit',
            key: 'credit',
            render: (value) => value ? `$${value.toFixed(2)}` : '-',
            sorter: (a, b) => (a.credit || 0) - (b.credit || 0)
        },
        {
            title: 'Balance',
            dataIndex: 'balance',
            key: 'balance',
            render: (value) => value ? `$${value.toFixed(2)}` : '-',
            sorter: (a, b) => (a.balance || 0) - (b.balance || 0)
        }
    ];

    // Prepare data for charts
    const categoryExpenseData = (analysisData.categories || [])?.filter(cat => cat.totalDebit > 0)
        .map((cat, index) => ({
            name: cat.category,
            value: cat.totalDebit,
            color: COLORS[index % COLORS.length]
        }));

    const categoryIncomeData = (analysisData.categories || [])
        .filter(cat => cat.totalCredit > 0)
        .map((cat, index) => ({
            name: cat.category,
            value: cat.totalCredit,
            color: COLORS[index % COLORS.length]
        }));

    const monthlyData = (analysisData.monthlySummary || []).map(month => ({
        name: month.month,
        income: month.totalCredit,
        expenses: month.totalDebit,
        cashflow: month.netCashflow
    }));

    // Get categories for filter dropdown
    const categories = ['All', ...new Set((analysisData.categories || []).map(cat => cat.category))];

    return (
        <div className="bank-statement-dashboard">
            <Title level={2} className="mb-4">Bank Statement Analysis</Title>

            {/* Filters */}
            <div className="mb-4 flex items-center space-x-4">
                <RangePicker
                    onChange={setDateRange}
                    className="mr-4"
                />
                <Select
                    defaultValue="All"
                    style={{ width: 200 }}
                    onChange={setSelectedCategory}
                >
                    {categories.map(cat => (
                        <Option key={cat} value={cat}>{cat}</Option>
                    ))}
                </Select>
            </div>

            {/* Summary Cards */}
            <Row gutter={16} className="mb-6">
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Income"
                            value={filteredSummary.totalCredit}
                            precision={2}
                            valueStyle={{ color: '#3f8600' }}
                            prefix={<ArrowUpOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Total Expenses"
                            value={filteredSummary.totalDebit}
                            precision={2}
                            valueStyle={{ color: '#cf1322' }}
                            prefix={<ArrowDownOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Net Cashflow"
                            value={filteredSummary.netCashflow}
                            precision={2}
                            valueStyle={{ color: filteredSummary.netCashflow >= 0 ? '#3f8600' : '#cf1322' }}
                            prefix={<DollarOutlined />}
                            suffix="$"
                        />
                    </Card>
                </Col>
                <Col span={6}>
                    <Card>
                        <Statistic
                            title="Transactions"
                            value={filteredSummary.transactionCount}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Charts and Tables Tabs */}
            <Tabs defaultActiveKey="1">
                <TabPane tab="Overview" key="1">
                    <Row gutter={16}>
                        <Col span={24} className="mb-4">
                            <Card title="Monthly Cashflow">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={monthlyData}>
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="income" name="Income" fill="#82ca9d" />
                                        <Bar dataKey="expenses" name="Expenses" fill="#ff8042" />
                                        <Line dataKey="cashflow" name="Net Cashflow" stroke="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    </Row>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title="Expense Breakdown">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryExpenseData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {categoryExpenseData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card title="Income Sources">
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={categoryIncomeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                                            outerRadius={80}
                                            fill="#82ca9d"
                                            dataKey="value"
                                        >
                                            {categoryIncomeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>

                <TabPane tab="Transactions" key="2">
                    <Card>
                        <Table
                            dataSource={getFilteredTransactions()}
                            columns={columns}
                            rowKey={(record, index) => index}
                            pagination={{ pageSize: 10 }}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="Category Analysis" key="3">
                    <Card>
                        <Table
                            dataSource={analysisData.categories}
                            rowKey="category"
                            pagination={false}
                            columns={[
                                {
                                    title: 'Category',
                                    dataIndex: 'category',
                                    key: 'category',
                                },
                                {
                                    title: 'Transactions',
                                    dataIndex: 'transactionCount',
                                    key: 'count',
                                    sorter: (a, b) => a.transactionCount - b.transactionCount,
                                },
                                {
                                    title: 'Expenses',
                                    dataIndex: 'totalDebit',
                                    key: 'expenses',
                                    render: (value) => `$${value.toFixed(2)}`,
                                    sorter: (a, b) => a.totalDebit - b.totalDebit,
                                },
                                {
                                    title: '% of Expenses',
                                    dataIndex: 'percentageOfExpenses',
                                    key: 'expensePercentage',
                                    render: (value) => `${value.toFixed(2)}%`,
                                    sorter: (a, b) => a.percentageOfExpenses - b.percentageOfExpenses,
                                },
                                {
                                    title: 'Income',
                                    dataIndex: 'totalCredit',
                                    key: 'income',
                                    render: (value) => `$${value.toFixed(2)}`,
                                    sorter: (a, b) => a.totalCredit - b.totalCredit,
                                },
                                {
                                    title: '% of Income',
                                    dataIndex: 'percentageOfIncome',
                                    key: 'incomePercentage',
                                    render: (value) => `${value.toFixed(2)}%`,
                                    sorter: (a, b) => a.percentageOfIncome - b.percentageOfIncome,
                                },
                                {
                                    title: 'Net Amount',
                                    dataIndex: 'netAmount',
                                    key: 'net',
                                    render: (value) => ({
                                        props: {
                                            style: { color: value >= 0 ? 'green' : 'red' }
                                        },
                                        children: `$${value.toFixed(2)}`
                                    }),
                                    sorter: (a, b) => a.netAmount - b.netAmount,
                                }
                            ]}
                        />
                    </Card>
                </TabPane>

                <TabPane tab="Summary" key="4">
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card title="Statement Overview">
                                <div className="p-4">
                                    <div className="mb-2">
                                        <Text strong>Period: </Text>
                                        <Text>{analysisData.analysis?.startDate} to {analysisData.analysis?.endDate}</Text>
                                    </div>
                                    <div className="mb-2">
                                        <Text strong>Total Transactions: </Text>
                                        <Text>{analysisData.analysis?.transactionCount}</Text>
                                    </div>
                                    <div className="mb-2">
                                        <Text strong>Total Income: </Text>
                                        <Text className="text-green-600">${analysisData.analysis?.totalCredit.toFixed(2)}</Text>
                                    </div>
                                    <div className="mb-2">
                                        <Text strong>Total Expenses: </Text>
                                        <Text className="text-red-600">${analysisData.analysis?.totalDebit.toFixed(2)}</Text>
                                    </div>
                                    <div className="mb-2">
                                        <Text strong>Net Cashflow: </Text>
                                        <Text style={{color: analysisData.analysis?.netCashflow >= 0 ? 'green' : 'red'}}>
                                            ${analysisData.analysis?.netCashflow.toFixed(2)}
                                        </Text>
                                    </div>
                                    <div className="mb-2">
                                        <Text strong>Average Transaction: </Text>
                                        <Text>${analysisData.analysis?.averageTransaction.toFixed(2)}</Text>
                                    </div>
                                </div>
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card title="Notable Transactions">
                                <div className="p-4">
                                    <div className="mb-4">
                                        <Title level={4} className="text-red-600">Largest Expense</Title>
                                        <div className="mb-2">
                                            <Text strong>Amount: </Text>
                                            <Text>${analysisData.analysis?.largestExpense?.amount.toFixed(2)}</Text>
                                        </div>
                                        <div className="mb-2">
                                            <Text strong>Date: </Text>
                                            <Text>{analysisData.analysis?.largestExpense?.date}</Text>
                                        </div>
                                        <div className="mb-2">
                                            <Text strong>Description: </Text>
                                            <Text>{analysisData.analysis?.largestExpense?.description}</Text>
                                        </div>
                                    </div>

                                    <div>
                                        <Title level={4} className="text-green-600">Largest Income</Title>
                                        <div className="mb-2">
                                            <Text strong>Amount: </Text>
                                            <Text>${analysisData.analysis?.largestIncome?.amount.toFixed(2)}</Text>
                                        </div>
                                        <div className="mb-2">
                                            <Text strong>Date: </Text>
                                            <Text>{analysisData.analysis?.largestIncome?.date}</Text>
                                        </div>
                                        <div className="mb-2">
                                            <Text strong>Description: </Text>
                                            <Text>{analysisData.analysis?.largestIncome?.description}</Text>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Col>
                    </Row>
                </TabPane>
            </Tabs>
        </div>
    );
};

export default BankStatementDashboard;

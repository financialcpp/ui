import pandas as pd

def get_symbols_test(price_over=None, price_under=None):
    """Returns list of symbols within a defined price range"""
    if price_over is None:
        price_over = 0
    if price_under is None:
        price_under = 20
    # return ['MSFT', 'AAPL', 'FSNN', 'BEBE', 'HELI', 'COSI', 'LNCO', 'TERP',
    #         'ICA', 'AXDX', 'VRA', 'PAGP']
    return ['MSFT', 'AAPL']

def get_symbols_full():
    df = pd.read_csv('nasdaqlisted.txt', sep='|')
    df = df[(df['Test Issue'] == 'N')]

    df2 = pd.read_csv('otherlisted.txt', sep='|')
    df2 = df2[(df2['Test Issue'] == 'N') & (df2['ETF'] == 'N')]
    # print df2
    df2 = df2[ (df2['NASDAQ Symbol'].str.contains("-") == False)]
    # df2 = df2[ (df2['NASDAQ Symbol'].str.contains(".") == False)]
    # df2 = df2[ (df2['NASDAQ Symbol'].str.contains("-") == False)]

    # df3 = pd.read_csv('otclist.txt', sep='|')
    # print df3

    return df['Symbol'].tolist() + df2['NASDAQ Symbol'].tolist()

def main():
    symbols = get_symbols_full()
    print len(symbols)
    symbols.sort()
    symbols = [s for s in symbols if "." not in s]
    symbols = [s for s in symbols if len(s) <= 4]
    with open("symbols.txt", "w") as f:
        for symbol in symbols:
            f.write(symbol+"\n")


if __name__ == '__main__':
    main()

from functools import reduce
import pandas as pd


def merge_dfs(dfs, **kwargs):
    """Merge a list of DataFrames on common columns
    """
    return reduce(lambda df1, df2: pd.merge(df1, df2, **kwargs), dfs)


def row_number(
    df, group_by, sort_by, col_name="row_number", ascending=True, as_series=False
):
    """Create a row number series given a DataFrame lists of columns for group by and sort by
    # Example:
        ```python
        df = row_number(df, ['group'], ['sort', 'order'])
        df['rn'] = row_number(df, ['group'], ['sort', 'order'], as_series=True)
        ```
    """
    if as_series:
        return df.sort_values(sort_by, ascending=ascending).groupby(group_by).cumcount()
    else:
        if col_name in list(df.columns):
            raise ValueError(f"Column  {col_name} already exists.")
        df[col_name] = (
            df.sort_values(sort_by, ascending=ascending).groupby(group_by).cumcount()
        )
        return df


def groupby_mutate(df, group_by, func_dict):
    """Similar to R's dplyr::mutate
    # Example
        ```python
        def func(x):
            return x['a'].nunique() / x['b'].nunique()
        func_dict = {
            'a_u': lambda x: x['a'].nunique(),
            'c': func
        }
        groupby_mutate(df, 'b', func_dict)
        ```
    """
    return (
        df.groupby(group_by, group_keys=False)
        .apply(
            lambda x: pd.Series(
                {col: func(x) for col, func in func_dict.items()},
                index=list(func_dict.keys()),
            )
        )
        .reset_index()
    )


def groupby_distinct(df, group_by, distinct):
    func_dict = {}
    if isinstance(distinct, list):
        for d in distinct:
            func_dict[d] = lambda x: x[d].nunique()
    else:
        func_dict[distinct] = lambda x: x[distinct].nunique()
    return groupby_mutate(df, group_by, func_dict)


def get_max_y_in_x(df, x, y):
    """Select row with maximum count from group2 in group1
    # Example
        ```
        df = pd.DataFrame({ 
            'host' : ['this.com', 'this.com', 'this.com', 'that.com', 'other.net', 'other.net', 'other.net'],
            'service' : ['mail', 'mail', 'web', 'mail', 'mail', 'web', 'web' ] })
        get_max_y_in_x(df, 'host', 'service')
        ```
    """

    df_indexed = df.groupby([x, y])[y].agg(count="count")
    mask = df_indexed.groupby(level=0).agg("idxmax")
    return df_indexed.loc[mask["count"]].reset_index()
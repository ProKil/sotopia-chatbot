'use client';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { CardContent, CardHeader, Collapse, styled } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { JSX, useState } from 'react';

interface CollapsibleCardProps {
    cardHeader: JSX.Element;
    cardContent: JSX.Element;
};

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
  }
  
  const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
  })(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  }));

export default function CollapsibleCard( { cardHeader, cardContent }: CollapsibleCardProps ) {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };
    return (
        <Card>
            {cardHeader}
            <CardActions sx={{ padding:0, maxHeight:20 }} disableSpacing >
                <ExpandMore
                expand={expanded}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
                >
                <ExpandMoreIcon/>
                </ExpandMore>
            </CardActions>

            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt:0 }}>
                    {cardContent}
                </CardContent>
            </Collapse>
        </Card>
    );
}